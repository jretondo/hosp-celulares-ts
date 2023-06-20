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
    Controller.list(undefined, req.body.query)
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

const listPagination = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    Controller.list(
        Number(req.params.page),
        String(req.query.query),
        Number(req.query.cantPerPage),
        Number(req.body.user.id)
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
    Controller.getUser(Number(req.params.id))
        .then((data) => {
            success({ req, res, message: data });
        })
        .catch(next)
}

const myDataUser = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    Controller.getUser(req.body.user.id)
        .then((data) => {
            success({ req, res, message: data });
        })
        .catch(next)
}

const addPvListUser = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    Controller.addPvUser(Number(req.body.userId), req.body.pvList).then(() => {
        success({ req, res, status: 201 });
    }).catch(next);
}

const getPvUser = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    Controller.getPvUser(Number(req.query.userId)).then((result) => {
        success({ req, res, message: result });
    }).catch(next)
}

router.get("/details/:id", secure(EPermissions.userAdmin), get);
router.get("/mydata", secure(), myDataUser)
router.get("/pvUser", secure(EPermissions.userAdmin), getPvUser)
router.get("/:page", secure(EPermissions.userAdmin), listPagination);
router.get("/", secure(EPermissions.userAdmin), list);
router.post("/pvUser", secure(EPermissions.userAdmin), addPvListUser)
router.post("/", upsert);
router.put("/", secure(EPermissions.userAdmin), upsert);
router.delete("/:id", secure(EPermissions.userAdmin), remove);

export = router;