import { IJoin, INewInsert, Ipages, IWhereParams } from 'interfaces/Ifunctions';
import { Iauth, IPuntosVentasUsuarios, IUser } from 'interfaces/Itables';
import { EConcatWhere, EModeWhere, ESelectFunct, ETypesJoin } from '../../../enums/EfunctMysql';
import { Tables, Columns } from '../../../enums/EtablesDB';
import StoreType from '../../../store/mysql';
import getPages from '../../../utils/getPages';
import Authcontroller from '../auth/index';

export = (injectedStore: typeof StoreType) => {
    let store = injectedStore;

    const list = async (page?: number, item?: string, cantPerPage?: number, idUsu?: number) => {

        const filters: Array<IWhereParams> | undefined = [];
        if (item) {
            const filter: IWhereParams | undefined = {
                mode: EModeWhere.like,
                concat: EConcatWhere.or,
                items: [
                    { column: Columns.admin.apellido, object: String(item) },
                    { column: Columns.admin.email, object: String(item) },
                    { column: Columns.admin.nombre, object: String(item) },
                    { column: Columns.admin.usuario, object: String(item) }
                ]
            };
            filters.push(filter);
        }

        if (idUsu) {
            const filter: IWhereParams | undefined = {
                mode: EModeWhere.dif,
                concat: EConcatWhere.and,
                items: [
                    { column: Columns.admin.id, object: String(idUsu) }
                ]
            };
            filters.push(filter);
        }

        let pages: Ipages;
        if (page) {
            pages = {
                currentPage: page,
                cantPerPage: cantPerPage || 10,
                order: Columns.admin.id,
                asc: true
            };
            const data = await store.list(Tables.ADMIN, [ESelectFunct.all], filters, undefined, pages);
            const cant = await store.list(Tables.ADMIN, [`COUNT(${ESelectFunct.all}) AS COUNT`], filters, undefined, undefined);
            const pagesObj = await getPages(cant[0].COUNT, 10, Number(page));
            return {
                data,
                pagesObj
            };
        } else {
            const data = await store.list(Tables.ADMIN, [ESelectFunct.all], filters, undefined, undefined);
            return {
                data
            };
        }
    }

    const upsert = async (body: IUser) => {
        const user: IUser = {
            nombre: body.nombre,
            apellido: body.apellido,
            email: body.email,
            usuario: body.usuario,
            pv: body.pv,
            cash_date: null,
            cash_found: 0
        }

        if (body.id) {
            return await store.update(Tables.ADMIN, user, body.id);
        } else {
            const result = await store.insert(Tables.ADMIN, user);
            const newAuth: Iauth = {
                id: result.insertId,
                usuario: user.usuario,
                prov: 1
            }
            return await Authcontroller.upsert(newAuth, body.email);
        }
    }

    const remove = async (idUser: number) => {
        await store.remove(Tables.ADMIN, { id: idUser })
            .then(async (result: any) => {
                if (result.affectedRows > 0) {
                    await store.remove(Tables.AUTH_ADMIN, { id: idUser })
                } else {
                    throw new Error();
                }
            })
    }

    const getUser = async (idUser: number): Promise<Array<IUser>> => {
        return await store.get(Tables.ADMIN, idUser);
    }

    const addPvUser = async (userId: number, pvListId: Array<{ pv_id: number }>) => {
        await store.remove(Tables.PUNTOS_VENTA_USUARIO, { usuario_id: userId });
        pvListId.map(async (item, key) => {
            const newPvUser: IPuntosVentasUsuarios = {
                usuario_id: userId,
                pv_id: item.pv_id
            }
            const result: INewInsert = await store.insert(Tables.PUNTOS_VENTA_USUARIO, newPvUser)
            if (result.affectedRows === 0) {
                throw Error("Hubo un error al querer insertar los puntos de venta.");
            }
        })
    }

    const getPvUser = async (idUser: number) => {
        const filters: Array<IWhereParams> | undefined = [];

        let filter: IWhereParams | undefined = {
            mode: EModeWhere.strict,
            concat: EConcatWhere.none,
            items: [
                { column: Columns.puntosVentaUsuarios.usuario_id, object: String(idUser) }
            ]
        };
        filters.push(filter);

        const joinQuery: IJoin = {
            table: Tables.PUNTOS_VENTA,
            colJoin: Columns.ptosVta.id,
            colOrigin: Columns.puntosVentaUsuarios.pv_id,
            type: ETypesJoin.none
        };

        const data = await store.list(Tables.PUNTOS_VENTA_USUARIO, ["*"], filters, undefined, undefined, [joinQuery]);
        return data;
    }

    return {
        list,
        upsert,
        remove,
        getUser,
        addPvUser,
        getPvUser
    }
}
