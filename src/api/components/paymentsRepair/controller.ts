import { Iorder } from './../../../interfaces/Ifunctions';
import { IPaymentsRepair } from './../../../interfaces/Itables';
import { IWhereParams } from 'interfaces/Ifunctions';
import { EConcatWhere, EModeWhere, ESelectFunct } from '../../../enums/EfunctMysql';
import { Tables, Columns } from '../../../enums/EtablesDB';
import StoreType from '../../../store/mysql';
import { NextFunction } from 'express';

export = (injectedStore: typeof StoreType) => {
    let store = injectedStore;

    const list = async (repairId: number) => {
        let filter: IWhereParams | undefined = undefined;
        let filters: Array<IWhereParams> = [];
        filter = {
            mode: EModeWhere.strict,
            concat: EConcatWhere.none,
            items: [
                { column: Columns.paymentsRepairs.repair_id, object: String(repairId) }
            ]
        };

        filters.push(filter)

        const order: Iorder = {
            columns: [Columns.paymentsRepairs.id],
            asc: true
        }

        const data = await store.list(Tables.PAYMENTS_REPAIRS, [ESelectFunct.all], filters, undefined, undefined, undefined, order);
        return {
            data
        };
    }

    const upsert = async (body: IPaymentsRepair, next: NextFunction) => {
        const repair: IPaymentsRepair = {
            detail: body.detail,
            repair_id: body.repair_id,
            type: body.type,
            amount: body.amount
        }

        try {
            if (body.id) {
                return await store.update(Tables.PAYMENTS_REPAIRS, repair, body.id);
            } else {
                return await store.insert(Tables.PAYMENTS_REPAIRS, repair);
            }
        } catch (error) {
            next(error)
        }
    }

    const customUpdate = async (object: object, paymentId: number, next: NextFunction) => {
        try {
            return await store.update(Tables.PAYMENTS_REPAIRS, object, paymentId);

        } catch (error) {
            next(error)
        }
    }

    const remove = async (paymentId: number) => {
        const result: any = await store.remove(Tables.PAYMENTS_REPAIRS, { id: paymentId })
        if (result.affectedRows > 0) {
            return 200
        } else {
            return 500
        }
    }

    const get = async (paymentId: number) => {
        return await store.get(Tables.PAYMENTS_REPAIRS, paymentId);
    }

    const getDifference = async (id: number) => {
        let filter: IWhereParams | undefined = undefined;
        let filters: Array<IWhereParams> = [];
        filter = {
            mode: EModeWhere.strict,
            concat: EConcatWhere.none,
            items: [
                { column: Columns.paymentsRepairs.repair_id, object: String(id) }
            ]
        };

        filters.push(filter)

        const paymentsTotal: Array<{ sum: number }> = await store.list(Tables.PAYMENTS_REPAIRS, [`SUM(${Columns.paymentsRepairs.amount}) as sum`], filters);
        filters = []
        filter = {
            mode: EModeWhere.strict,
            concat: EConcatWhere.none,
            items: [
                { column: Columns.repairs.id, object: String(id) }
            ]
        };

        filters.push(filter)

        const repairAmount: Array<{ sum: number }> = await store.list(Tables.REPAIRS, [`SUM(${Columns.repairs.final_price}) as sum`], filters);

        const difference = repairAmount[0].sum - paymentsTotal[0].sum;

        return difference
    }

    return {
        list,
        upsert,
        remove,
        get,
        customUpdate,
        getDifference
    }
}
