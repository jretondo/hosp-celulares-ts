import { error } from './../../../network/response';
import { franchiseSendPass } from './../../../utils/sendEmails/sendPassFranchise';
import { passCreator } from './../../../utils/passCreator';
import { IFranchise } from './../../../interfaces/Itables';
import { IWhereParams } from 'interfaces/Ifunctions';
import bcrypt from 'bcrypt';
import { EConcatWhere, EModeWhere, ESelectFunct } from '../../../enums/EfunctMysql';
import { Tables, Columns } from '../../../enums/EtablesDB';
import StoreType from '../../../store/mysql';
import { NextFunction } from 'express';
import { sendPass } from 'utils/sendEmails/sendPass';

export = (injectedStore: typeof StoreType) => {
    let store = injectedStore;

    const list = async (item?: string) => {
        let filter: IWhereParams | undefined = undefined;
        let filters: Array<IWhereParams> = [];
        if (item) {
            filter = {
                mode: EModeWhere.like,
                concat: EConcatWhere.or,
                items: [
                    { column: Columns.franchise.name, object: String(item) },
                    { column: Columns.franchise.email, object: String(item) },
                    { column: Columns.franchise.direction, object: String(item) },
                    { column: Columns.franchise.f_user, object: String(item) },
                    { column: Columns.franchise.obs, object: String(item) }
                ]
            };
            filters.push(filter);
        }

        const data = await store.list(Tables.FRANCHISE, [Columns.franchise.id, Columns.franchise.name, Columns.franchise.email, Columns.franchise.f_user, Columns.franchise.obs, Columns.franchise.phone, Columns.franchise.direction], filters, undefined, undefined);
        return {
            data
        };
    }

    const upsert = async (body: IFranchise, next: NextFunction) => {
        try {
            if (body.id) {

                const franchise: IFranchise = {
                    name: body.name,
                    direction: body.direction,
                    f_user: body.f_user,
                    email: body.email,
                    obs: body.obs,
                    phone: body.phone
                }
                return await store.update(Tables.FRANCHISE, franchise, body.id);
            } else {
                const newPass = await passCreator();

                const franchise: IFranchise = {
                    name: body.name,
                    direction: body.direction,
                    f_user: body.f_user,
                    pass: await bcrypt.hash(newPass, 5),
                    email: body.email,
                    obs: body.obs,
                    phone: body.phone,
                    provisory_pass: true
                }
                let result = await store.insert(Tables.FRANCHISE, franchise);
                if (result.affectedRows > 0) {
                    return await franchiseSendPass(body.f_user, newPass, body.email, "Nuevo Usuario", true, false, body.name);
                } else {
                    throw error
                }
            }
        } catch (error) {
            next(error)
        }
    }

    const remove = async (idFranchise: number) => {
        const result: any = await store.remove(Tables.FRANCHISE, { id: idFranchise });

        if (result.affectedRows > 0) {
            return 200
        } else {
            return 500
        }
    }

    const get = async (idFranchise: number) => {
        return await store.get(Tables.FRANCHISE, idFranchise);
    }

    const resetPass = async (idFranchise: number) => {
        const newPass = await passCreator();
        const result = await store.update(Tables.FRANCHISE, { pass: await bcrypt.hash(newPass, 5) }, idFranchise);
        if (result.affectedRows > 0) {
            const franchiseData: Array<IFranchise> = await get(idFranchise)

            return await franchiseSendPass(franchiseData[0].f_user, newPass, franchiseData[0].email, "Nueva contraseña", false, false, franchiseData[0].name);
        } else {
            throw error
        }
    }

    return {
        list,
        upsert,
        remove,
        get,
        resetPass
    }
}
