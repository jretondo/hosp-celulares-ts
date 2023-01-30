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
        String(req.query.fromDate),
        String(req.query.toDate),
        String(req.query.search),
        Number(req.query.pvId),
        Number(req.query.state),
        Number(req.query.userId),
        Number(req.query.typeId),
        Number(req.params.page),
        Number(req.query.cantPerPage)
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
    Controller.upsert(req.body, req.body.user.id, next)
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

const upsertState = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    Controller.upsertState(req.body)
        .then((result) => {
            success({ req, res, status: 200, message: result });
        })
        .catch(next)
}

const upsertTypes = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    Controller.upsertType(req.body)
        .then((result) => {
            success({ req, res, status: 200, message: result });
        })
        .catch(next)
}

const removeStates = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    Controller.removeStates(Number(req.params.id))
        .then((status) => {
            success({ req, res, status: status });
        })
        .catch(next)
}

const removeTypes = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    Controller.removeTypes(Number(req.params.id))
        .then((status) => {
            success({ req, res, status: status });
        })
        .catch(next)
}

const getStates = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    Controller.getStates()
        .then((data) => {
            success({ req, res, message: data })
        })
        .catch(next)
}

const getTypes = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    Controller.getTypes()
        .then((data) => {
            success({ req, res, message: data })
        })
        .catch(next)
}

const getState = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    Controller.getState(Number(req.params.id))
        .then((data) => {
            success({ req, res, message: data })
        })
        .catch(next)
}

const getType = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    Controller.getType(Number(req.params.id))
        .then((data) => {
            success({ req, res, message: data })
        })
        .catch(next)
}

router
    .get("/states", secure(EPermissions.parts), getStates)
    .get("/states/:id", secure(EPermissions.parts), getState)
    .post("/states", secure(EPermissions.parts), upsertState)
    .patch("/states", secure(EPermissions.parts), upsertState)
    .delete("/states/:id", secure(EPermissions.parts), removeStates)
    .get("/types", secure(EPermissions.parts), getTypes)
    .get("/types/:id", secure(EPermissions.parts), getType)
    .post("/types", secure(EPermissions.parts), upsertTypes)
    .patch("/types", secure(EPermissions.parts), upsertTypes)
    .delete("/types/:id", secure(EPermissions.parts), removeTypes)
    .get("/details/:id", secure(EPermissions.parts), get)
    .get("/:page", secure(EPermissions.parts), list)
    .delete("/:id", secure(EPermissions.parts), remove)
    .patch("/", secure(EPermissions.parts), customUpdate)
    .post("/", secure(EPermissions.parts), upsert)
    .put("/", secure(EPermissions.parts), upsert)

export = router;