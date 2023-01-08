import { error } from './../../../network/response';
import { Tables } from '../../../enums/EtablesDB';
import StoreType from '../../../store/mysql';
import bcrypt from 'bcrypt';
import { passCreator } from '../../../utils/passCreator';
import { sendPass } from '../../../utils/sendEmails/sendPass';
import auth from '../../../auth';
import { Iauth, IFranchise, IUser } from 'interfaces/Itables';
import { franchiseSendPass } from '../../../utils/sendEmails/sendPassFranchise';

export = (injectedStore: typeof StoreType) => {
    let store = injectedStore;

    const upsert = async (body: Iauth, email: string) => {
        let newAuth: Iauth;
        if (body.pass) {
            newAuth = {
                usuario: body.usuario,
                prov: body.prov,
                pass: await bcrypt.hash(body.pass, 5)
            };
            if (body.prov === 1) {
                const result = await store.update(Tables.AUTH_ADMIN, newAuth, Number(body.id));
                if (result.affectedRows > 0) {
                    return await sendPass(body.usuario, body.pass, email, "Nueva contraseña", false, false);
                } else {
                    return false;
                }
            } else {
                return await store.update(Tables.AUTH_ADMIN, newAuth, Number(body.id));
            }
        } else {
            const newPass = await passCreator();
            newAuth = {
                id: body.id,
                usuario: body.usuario,
                prov: 1,
                pass: await bcrypt.hash(newPass, 5)
            };
            const result = await store.insert(Tables.AUTH_ADMIN, newAuth);
            if (result.affectedRows > 0) {
                return await sendPass(body.usuario, newPass, email, "Nuevo Usuario", true, false);
            } else {
                return false;
            }
        }
    }

    const recPass = async (email: string) => {
        const newPass = await passCreator();
        const userData = await store.query(Tables.ADMIN, { email: email });
        const idUsu = userData[0].id;
        const usuario = userData[0].usuario;
        const data: Iauth = {
            id: idUsu,
            usuario: usuario,
            prov: 1,
            pass: newPass
        };

        return await upsert(data, email);
    }

    const login = async (username: string, password: string) => {
        const data3 = await store.query(Tables.AUTH_ADMIN, { usuario: username })
        const data2 = await store.query(Tables.ADMIN, { usuario: username })
        const userData = data2[0]
        const data = {
            ...data2[0],
            ...data3[0]
        }

        const prov = data.prov
        return bcrypt.compare(password, data.pass)
            .then(same => {
                if (same) {
                    return {
                        token: auth.sign(JSON.stringify(data)),
                        userData: userData,
                        provisory: prov
                    }
                } else {
                    throw new Error('información invalida')
                }
            })
    }

    const FranchisesLogin = async (username: string, password: string) => {
        const data: Array<IFranchise> = await store.query(Tables.FRANCHISE, { f_user: username })

        const prov = data[0].provisory_pass
        return bcrypt.compare(password, data[0].pass || "")
            .then(same => {
                if (same) {
                    return {
                        token: auth.sign(JSON.stringify(data)),
                        userData: data[0],
                        provisory: prov
                    }
                } else {
                    throw new Error('información invalida')
                }
            })
    }

    const FranchiseChangePass = async (user: Array<IUser>, newPass: string) => {

        return await store.update(Tables.FRANCHISE, { pass: await bcrypt.hash(newPass, 5), provisory_pass: 0 }, user[0].id || 0);
    }

    const franchiseRecPass = async (email: string) => {
        const newPass = await passCreator();
        const franchiseData: Array<IFranchise> = await store.query(Tables.FRANCHISE, { email: email });
        const idFranchise = franchiseData[0].id;

        const result = await store.update(Tables.FRANCHISE, { pass: await bcrypt.hash(newPass, 5), provisory_pass: 1 }, idFranchise || 0);

        if (result.affectedRows > 0) {
            const franchiseData: Array<IFranchise> = await store.get(Tables.FRANCHISE, idFranchise || 0);

            return await franchiseSendPass(franchiseData[0].f_user, newPass, franchiseData[0].email, "Nueva contraseña", false, false, franchiseData[0].name || "");
        } else {
            throw error
        }
    }


    return {
        upsert,
        login,
        recPass,
        FranchisesLogin,
        FranchiseChangePass,
        franchiseRecPass
    }
}
