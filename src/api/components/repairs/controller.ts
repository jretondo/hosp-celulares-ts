import { IRepairs } from './../../../interfaces/Itables';
import { Ipages, IWhereParams, IJoin, INewInsert } from 'interfaces/Ifunctions';
import { IClientes, } from 'interfaces/Itables';
import { EConcatWhere, EModeWhere, ESelectFunct, ETypesJoin } from '../../../enums/EfunctMysql';
import { Tables, Columns } from '../../../enums/EtablesDB';
import StoreType from '../../../store/mysql';
import getPages from '../../../utils/getPages';
import { NextFunction } from 'express';

export = (injectedStore: typeof StoreType) => {
    let store = injectedStore;

    const list = async (dateFrom: string, dateTo: string, item?: string, pvId?: number, state?: number, page?: number, cantPerPage?: number) => {
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
        if (pvId) {
            filter = {
                mode: EModeWhere.strict,
                concat: EConcatWhere.none,
                items: [
                    { column: Columns.repairs.pv_id, object: String(pvId) }
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
            table: Tables.PUNTOS_VENTA,
            colJoin: Columns.ptosVta.id,
            colOrigin: Columns.repairs.pv_id,
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
            const data = await store.list(Tables.REPAIRS, [`${Tables.REPAIRS}.${Columns.repairs.id}`, Columns.repairs.date, Columns.repairs.client, Columns.repairs.state, Columns.repairs.hpc_cost, Columns.repairs.part_cost, Columns.repairs.service_cost, Columns.repairs.final_price, Columns.repairs.pv_id, `${Tables.PUNTOS_VENTA}.${Columns.ptosVta.direccion}`, `${Tables.PUNTOS_VENTA}.${Columns.ptosVta.raz_soc}`, Columns.repairs.difference, Columns.repairs.detail], filters, undefined, pages, [join]);
            const cant = await store.list(Tables.REPAIRS, [`COUNT(${ESelectFunct.all}) AS COUNT`], filters, undefined, undefined, [join]);
            const pagesObj = await getPages(cant[0].COUNT, 10, Number(page));
            const summarizes = await store.list(Tables.REPAIRS, [`SUM(${Columns.repairs.hpc_cost}) AS total_hpc_cost`, `SUM(${Columns.repairs.final_price}) AS total_final_price`, `SUM(${Columns.repairs.difference}) AS total_difference`], filters, undefined, undefined, [join]);
            return {
                data,
                pagesObj,
                summarizes
            };
        } else {
            const data = await store.list(Tables.REPAIRS, [ESelectFunct.all], filters, undefined, undefined, [join]);
            const summarizes = await store.list(Tables.REPAIRS, [`SUM(${Columns.repairs.hpc_cost}) AS total_hpc_cost`, `SUM(${Columns.repairs.final_price}) AS total_final_price`, `SUM(${Columns.repairs.difference}) AS total_difference`], filters, undefined, undefined, [join]);
            return {
                data,
                summarizes
            };
        }
    }

    const upsert = async (body: IRepairs, userId: number, next: NextFunction) => {
        const repair: IRepairs = {
            detail: body.detail,
            client: body.client,
            part_cost: body.part_cost,
            service_cost: body.service_cost,
            hpc_cost: Number(body.part_cost) + Number(body.service_cost),
            final_price: body.final_price,
            state: body.state,
            pv_id: body.pv_id,
            user_reg: userId,
            difference: Number(body.final_price) - (Number(body.part_cost) + Number(body.service_cost))
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

    const customUpdate = async (object: object, repairId: number, next: NextFunction) => {
        try {
            return await store.update(Tables.REPAIRS, object, repairId);

        } catch (error) {
            next(error)
        }
    }

    const remove = async (idRepair: number) => {
        const result: any = await store.remove(Tables.REPAIRS, { id: idRepair })
        if (result.affectedRows > 0) {
            return 200
        } else {
            return 500
        }
    }

    const get = async (idCliente: number) => {
        return await store.get(Tables.CLIENTES, idCliente);
    }

    return {
        list,
        upsert,
        remove,
        get,
        customUpdate
    }
}
