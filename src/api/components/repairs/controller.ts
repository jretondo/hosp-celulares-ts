import { IRepairs } from './../../../interfaces/Itables';
import { Ipages, IWhereParams, IJoin } from 'interfaces/Ifunctions';
import { IClientes, } from 'interfaces/Itables';
import { EConcatWhere, EModeWhere, ESelectFunct, ETypesJoin } from '../../../enums/EfunctMysql';
import { Tables, Columns } from '../../../enums/EtablesDB';
import StoreType from '../../../store/mysql';
import getPages from '../../../utils/getPages';
import { NextFunction } from 'express';

export = (injectedStore: typeof StoreType) => {
    let store = injectedStore;

    const list = async (dateFrom: string, dateTo: string, item?: string, franchiseId?: number, state?: number, page?: number, cantPerPage?: number) => {
        let filter: IWhereParams | undefined = undefined;
        let filters: Array<IWhereParams> = [];
        filter = {
            mode: EModeWhere.higherEqual,
            concat: EConcatWhere.none,
            items: [
                { column: Columns.repairs.date, object: String(dateFrom + " 00:00:00") }
            ]
        };
        filters.push(filter);

        filter = {
            mode: EModeWhere.lessEqual,
            concat: EConcatWhere.none,
            items: [
                { column: Columns.repairs.date, object: String(dateTo + " 23:59:99") }
            ]
        };
        filters.push(filter);

        if (item) {
            filter = {
                mode: EModeWhere.like,
                concat: EConcatWhere.or,
                items: [
                    { column: Columns.repairs.client, object: String(item) },
                    { column: Columns.repairs.detail, object: String(item) }
                ]
            };
            filters.push(filter);
        }
        if (franchiseId) {
            filter = {
                mode: EModeWhere.strict,
                concat: EConcatWhere.none,
                items: [
                    { column: Columns.repairs.franchise_id, object: String(franchiseId) }
                ]
            };
            filters.push(filter);
        }

        if (state) {
            filter = {
                mode: EModeWhere.strict,
                concat: EConcatWhere.none,
                items: [
                    { column: Columns.repairs.state, object: String(state) }
                ]
            };
            filters.push(filter);
        }

        const join: IJoin = {
            table: Tables.FRANCHISE,
            colJoin: Columns.franchise.id,
            colOrigin: Columns.repairs.franchise_id,
            type: ETypesJoin.left
        }
        let pages: Ipages;
        if (page) {
            pages = {
                currentPage: page,
                cantPerPage: cantPerPage || 10,
                order: Columns.clientes.id,
                asc: false
            };
            const data = await store.list(Tables.REPAIRS, [`${Tables.REPAIRS}.${Columns.repairs.id}`, Columns.repairs.date, Columns.repairs.client, Columns.repairs.state, Columns.repairs.hpc_cost, Columns.repairs.part_cost, Columns.repairs.service_cost, Columns.repairs.final_price, Columns.repairs.franchise_id, `${Tables.FRANCHISE}.${Columns.franchise.name}`], filters, undefined, pages, join);
            const cant = await store.list(Tables.REPAIRS, [`COUNT(${ESelectFunct.all}) AS COUNT`], filters, undefined, undefined, join);
            const pagesObj = await getPages(cant[0].COUNT, 10, Number(page));
            return {
                data,
                pagesObj
            };
        } else {
            const data = await store.list(Tables.REPAIRS, [ESelectFunct.all], filters, undefined, undefined, join);
            return {
                data
            };
        }
    }

    const upsert = async (body: IRepairs, userId: number, next: NextFunction) => {
        console.log('body :>> ', body);
        const repair: IRepairs = {
            detail: body.detail,
            client: body.client,
            part_cost: body.part_cost,
            service_cost: body.service_cost,
            hpc_cost: Number(body.part_cost) + Number(body.service_cost),
            final_price: body.final_price,
            state: body.state,
            franchise_id: body.franchise_id,
            user_reg: userId
        }

        try {
            if (body.id) {
                return await store.update(Tables.REPAIRS, repair, body.id);
            } else {
                return await store.insert(Tables.REPAIRS, repair);
            }
        } catch (error) {
            next(error)
        }
    }

    const remove = async (idCliente: number) => {
        return 200
    }

    const get = async (idCliente: number) => {
        return await store.get(Tables.CLIENTES, idCliente);
    }

    return {
        list,
        upsert,
        remove,
        get,
    }
}
