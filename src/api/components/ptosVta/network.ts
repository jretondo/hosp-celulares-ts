import { Router, NextFunction, Response, Request } from 'express';
import { success } from '../../../network/response';
const router = Router();
import Controller from './index';
import secure from '../../../auth/secure';
import { EPermissions } from '../../../enums/EfunctMysql';
import uploadFile from '../../../utils/multer';
import { staticFolders } from '../../../enums/EStaticFiles';

const list = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    Controller.list(
        req.body.user,
        Number(req.params.page),
        undefined,
        Number(req.query.cantPerPage)
    )
        .then((lista: any) => {
            success({
                req,
                res,
                status: 200,
                message: lista
            });
        })
        .catch(next)
};

const list2 = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    Controller.list(req.body.user)
        .then((lista: any) => {
            success({
                req,
                res,
                status: 200,
                message: lista
            });
        })
        .catch(next)
};

const upsert = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    Controller.upsert(req.body)
        .then(response => {
            if (response) {
                success({
                    req,
                    res
                });
            } else {
                next(response);
            }
        })
        .catch(next)
}

const remove = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    Controller.remove(Number(req.params.id))
        .then(() => {
            success({ req, res });
        })
        .catch(next)
}

const get = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    Controller.get(Number(req.params.id))
        .then(data => {
            success({ req, res, message: data });
        })
        .catch(next);
};

const getUserPv = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    Controller.getUserPv(req.body.user)
        .then(data => {
            success({ req, res, message: data });
        })
        .catch(next);
};

router.get("/list", secure(), list2);
router.get("/details/:id", secure(EPermissions.ptosVta), get);
router.get("/userPv", secure(), getUserPv);
router.get("/:page", secure(), list);
router.get("/", secure(), list);
router.post("/", secure(EPermissions.ptosVta), uploadFile(staticFolders.certAfip, ["cert", "key"]), upsert);
router.put("/", secure(EPermissions.ptosVta), uploadFile(staticFolders.certAfip, ["cert", "key"]), upsert);
router.delete("/:id", secure(EPermissions.ptosVta), remove);

export = router;