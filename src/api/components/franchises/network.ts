import { Router, NextFunction, Response, Request } from 'express';
import { file, success } from '../../../network/response';
const router = Router();
import Controller from './index';
import secure from '../../../auth/secure';
import { EPermissions } from '../../../enums/EfunctMysql';

const list = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    Controller.list(String(req.query.query))
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
    Controller.upsert(req.body, next)
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
        .then((status) => {
            success({ req, res, status: status });
        })
        .catch(next)
}

const get = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    Controller.get(Number(req.params.id))
        .then((data) => {
            success({ req, res, message: data })
        })
        .catch(next)
}

const resetPass = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    Controller.resetPass(Number(req.params.id))
        .then((data) => {
            success({ req, res, message: data })
        })
        .catch(next)
}

router
    .get("/details/:id", secure(EPermissions.franquicias), get)
    .put("/pass/:id", secure(EPermissions.franquicias), resetPass)
    .delete("/:id", secure(EPermissions.franquicias), remove)
    .get("/", secure(EPermissions.franquicias), list)
    .post("/", secure(EPermissions.franquicias), upsert)
    .put("/", secure(EPermissions.franquicias), upsert)

export = router;