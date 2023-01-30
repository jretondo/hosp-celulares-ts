import { INewPV } from 'interfaces/Irequests';
import { IPartsAccessories, IPartAccessoryStates, IPartAccessorytypes, IUser } from './../../../interfaces/Itables';
import { Ipages, IWhereParams, IJoin, INewInsert, Iorder } from 'interfaces/Ifunctions';
import { EConcatWhere, EModeWhere, ESelectFunct, ETypesJoin } from '../../../enums/EfunctMysql';
import { Tables, Columns } from '../../../enums/EtablesDB';
import StoreType from '../../../store/mysql';
import getPages from '../../../utils/getPages';
import { NextFunction } from 'express';

import UsersController from '../user';
import PtoVtaController from '../ptosVta';

export = (injectedStore: typeof StoreType) => {
    let store = injectedStore;

    const list = async (dateFrom: string, dateTo: string, item?: string, pvId?: number, stateId?: number, userId?: number, typeId?: number, page?: number, cantPerPage?: number) => {
        let filter: IWhereParams | undefined = undefined;
        let filters: Array<IWhereParams> = [];
        filter = {
            mode: EModeWhere.higherEqual,
            concat: EConcatWhere.none,
            items: [
                { column: Columns.partsAccessories.created_time, object: String(dateFrom + " 00:00:00") }
            ]
        };
        filters.push(filter);

        filter = {
            mode: EModeWhere.lessEqual,
            concat: EConcatWhere.none,
            items: [
                { column: Columns.partsAccessories.created_time, object: String(dateTo + " 23:59:99") }
            ]
        };
        filters.push(filter);

        if (item) {
            filter = {
                mode: EModeWhere.like,
                concat: EConcatWhere.or,
                items: [
                    { column: Columns.partsAccessories.model, object: String(item) },
                    { column: `${Tables.PARTS_ACCESSORIES}.${Columns.partsAccessories.color}`, object: String(item) },
                    { column: Columns.partsAccessories.observations, object: String(item) }
                ]
            };
            filters.push(filter);
        }
        if (pvId) {
            filter = {
                mode: EModeWhere.strict,
                concat: EConcatWhere.none,
                items: [
                    { column: Columns.partsAccessories.pv_id, object: String(pvId) }
                ]
            };
            filters.push(filter);
        }

        if (userId) {
            filter = {
                mode: EModeWhere.strict,
                concat: EConcatWhere.none,
                items: [
                    { column: Columns.partsAccessories.user_id, object: String(userId) }
                ]
            };
            filters.push(filter);
        }

        if (stateId) {
            filter = {
                mode: EModeWhere.strict,
                concat: EConcatWhere.none,
                items: [
                    { column: Columns.partsAccessories.state_id, object: String(stateId) }
                ]
            };
            filters.push(filter);
        }

        if (typeId) {
            filter = {
                mode: EModeWhere.strict,
                concat: EConcatWhere.none,
                items: [
                    { column: Columns.partsAccessories.type_id, object: String(typeId) }
                ]
            };
            filters.push(filter);
        }

        if (pvId) {
            filter = {
                mode: EModeWhere.strict,
                concat: EConcatWhere.none,
                items: [
                    { column: Columns.partsAccessories.pv_id, object: String(pvId) }
                ]
            };
            filters.push(filter);
        }

        const join1: IJoin = {
            table: Tables.PART_ACCESSORY_STATES,
            colJoin: Columns.partAccessoryStates.id,
            colOrigin: Columns.partsAccessories.state_id,
            type: ETypesJoin.left
        }

        const join2: IJoin = {
            table: Tables.PART_ACCESSORY_TYPES,
            colJoin: Columns.partAccessoryTypes.id,
            colOrigin: Columns.partsAccessories.type_id,
            type: ETypesJoin.left
        }

        const join3: IJoin = {
            table: Tables.PUNTOS_VENTA,
            colJoin: Columns.ptosVta.id,
            colOrigin: Columns.partsAccessories.pv_id,
            type: ETypesJoin.left
        }

        const join4: IJoin = {
            table: Tables.ADMIN,
            colJoin: Columns.admin.id,
            colOrigin: Columns.partsAccessories.user_id,
            type: ETypesJoin.left
        }

        let pages: Ipages;
        if (page) {
            pages = {
                currentPage: page,
                cantPerPage: cantPerPage || 10,
                order: Columns.partsAccessories.id,
                asc: false
            };
            const data = await store.list(Tables.PARTS_ACCESSORIES, [`${Tables.PARTS_ACCESSORIES}.${Columns.partsAccessories.id}`, `${Columns.partsAccessories.created_time} as date`, `${Tables.PARTS_ACCESSORIES}.${Columns.partsAccessories.color} as accessoryColor`, Columns.partsAccessories.model, Columns.partsAccessories.observations, `${Tables.PART_ACCESSORY_STATES}.${Columns.partAccessoryStates.color} as stateColor`, `${Tables.PART_ACCESSORY_STATES}.${Columns.partAccessoryStates.state}`, `${Tables.ADMIN}.${Columns.admin.apellido} as name`, `${Tables.ADMIN}.${Columns.admin.nombre} as lastname`, `${Tables.PUNTOS_VENTA}.${Columns.ptosVta.direccion} as direction`, `${Tables.PUNTOS_VENTA}.${Columns.ptosVta.pv} as pv`, `${Tables.PART_ACCESSORY_TYPES}.${Columns.partAccessoryTypes.type} as accessoryType`, `${Tables.PART_ACCESSORY_TYPES}.${Columns.partAccessoryTypes.id} as accessoryTypeId`], filters, undefined, pages, [join1, join2, join3, join4]);
            const cant = await store.list(Tables.PARTS_ACCESSORIES, [`COUNT(${ESelectFunct.all}) AS COUNT`], filters, undefined, undefined, [join1]);
            const pagesObj = await getPages(cant[0].COUNT, 10, Number(page));
            return {
                data,
                pagesObj
            };
        } else {
            const data = await store.list(Tables.PARTS_ACCESSORIES, [ESelectFunct.all], filters, undefined, undefined, [join1]);
            return {
                data
            };
        }
    }

    const upsert = async (body: IPartsAccessories, userId: number, next: NextFunction) => {
        const part: IPartsAccessories = {
            color: body.color,
            model: body.model,
            observations: body.observations,
            pv_id: body.pv_id,
            state_id: body.state_id,
            type_id: body.type_id,
            user_id: userId
        }

        try {
            if (body.id) {
                return await store.update(Tables.PARTS_ACCESSORIES, part, body.id);
            } else {
                return await store.insert(Tables.PARTS_ACCESSORIES, part);
            }
        } catch (error) {
            next(error)
        }
    }

    const customUpdate = async (object: object, partId: number, next: NextFunction) => {
        console.log('object :>> ', object);
        console.log('partId :>> ', partId);
        try {
            return await store.update(Tables.PARTS_ACCESSORIES, object, partId);
        } catch (error) {
            next(error)
        }
    }

    const remove = async (partId: number) => {
        const result: any = await store.remove(Tables.PARTS_ACCESSORIES, { id: partId })
        if (result.affectedRows > 0) {
            return 200
        } else {
            return 500
        }
    }

    const get = async (partId: number) => {
        const part: IPartsAccessories[] = await store.get(Tables.PARTS_ACCESSORIES, partId);
        const state: IPartAccessoryStates[] = await getState(part[0].state_id)
        const type: IPartAccessorytypes[] = await getType(part[0].type_id)
        const user: IUser[] = await UsersController.getUser(part[0].user_id)
        const ptoVta: INewPV[] = await PtoVtaController.get(part[0].pv_id)

        return {
            part: part[0],
            state: state[0],
            type: type[0],
            user: user[0],
            ptoVta: ptoVta[0]
        }
    }

    const upsertState = async (body: IPartAccessoryStates) => {
        if (body.id) {
            const result: INewInsert = await store.update(Tables.PART_ACCESSORY_STATES, { state: body.state, color: body.color }, body.id);
            if (result.affectedRows > 0) {
                return result
            } else {
                throw Error("No se pudo modificar el estado")
            }
        } else {
            const result: INewInsert = await store.insert(Tables.PART_ACCESSORY_STATES, { state: body.state, color: body.color });
            if (result.affectedRows > 0) {
                return result
            } else {
                throw Error("No se pudo agregar el tipo")
            }
        }
    }

    const upsertType = async (body: IPartAccessorytypes) => {
        if (body.id) {
            const result: INewInsert = await store.update(Tables.PART_ACCESSORY_TYPES, { type: body.type }, body.id);
            result.insertId
            if (result.affectedRows > 0) {
                return result
            } else {
                throw Error("No se pudo modificar el tipo")
            }
        } else {
            const result: INewInsert = await store.insert(Tables.PART_ACCESSORY_TYPES, { type: body.type });
            if (result.affectedRows > 0) {
                return result
            } else {
                throw Error("No se pudo agregar el tipo")
            }
        }
    }

    const getTypes = async () => {
        const order: Iorder = {
            columns: [Columns.partAccessoryTypes.type],
            asc: true
        }
        return await store.list(Tables.PART_ACCESSORY_TYPES, ["*"], undefined, undefined, undefined, undefined, order);
    }

    const getStates = async () => {
        const order: Iorder = {
            columns: [Columns.partAccessoryStates.state],
            asc: true
        }
        return await store.list(Tables.PART_ACCESSORY_STATES, ["*"], undefined, undefined, undefined, undefined, order);
    }

    const getType = async (idType: number) => {
        return await store.get(Tables.PART_ACCESSORY_TYPES, idType);
    }

    const getState = async (idState: number) => {
        return await store.get(Tables.PART_ACCESSORY_STATES, idState);
    }

    const removeTypes = async (idType: number) => {
        const result: any = await store.remove(Tables.PART_ACCESSORY_TYPES, { id: idType });
        if (result.affectedRows > 0) {
            return 200
        } else {
            return 500
        }
    }

    const removeStates = async (idState: number) => {
        const result: any = await store.remove(Tables.PART_ACCESSORY_STATES, { id: idState });
        if (result.affectedRows > 0) {
            return 200
        } else {
            return 500
        }
    }


    return {
        list,
        upsert,
        remove,
        get,
        customUpdate,
        upsertState,
        upsertType,
        getStates,
        getTypes,
        getState,
        getType,
        removeStates,
        removeTypes
    }
}
