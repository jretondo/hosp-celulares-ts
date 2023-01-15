import { Router, NextFunction, Response, Request } from 'express';
import { success } from '../../../network/response';
const router = Router();
import Controller from './index';
import secure from '../../../auth/secure';
import { EPermissions } from '../../../enums/EfunctMysql';

const list = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    Controller.list(
        Number(req.query.repairId)
    ).then((lista: any) => {
        success({
            req,
            res,
            status: 200,
            message: lista
        });
    })
        .catch(next)
};

const listPagination = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    Controller.list(
        Number(req.query.repairId)
    ).then((lista: any) => {
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

const customUpdate = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    Controller.customUpdate(
        req.body.update,
        req.body.id,
        next
    )
        .then((data) => {
            success({ req, res, message: data })
        })
        .catch(next)
}

const getDifference = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    Controller.getDifference(
        Number(req.params.id)
    )
        .then((data) => {
            success({ req, res, message: data })
        })
        .catch(next)
}


router
    .get("/difference/:id", secure(EPermissions.reparaciones), getDifference)
    .get("/details/:id", secure(EPermissions.reparaciones), get)
    .get("/:page", secure(EPermissions.reparaciones), listPagination)
    .delete("/:id", secure(EPermissions.reparaciones), remove)
    .patch("/", secure(EPermissions.reparaciones), customUpdate)
    .get("/", secure(EPermissions.reparaciones), list)
    .post("/", secure(EPermissions.reparaciones), upsert)
    .put("/", secure(EPermissions.reparaciones), upsert)

export = router;