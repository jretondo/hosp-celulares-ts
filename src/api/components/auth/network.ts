import { Router, NextFunction, Response, Request } from 'express';
import { success } from '../../../network/response';
const router = Router();
import Controller from './index';
import secure from '../../../auth/secure';

const login = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    Controller.login(req.body.username, req.body.password)
        .then((userData) => {
            success({ req, res, message: userData })
        })
        .catch(next)
};

const franchiseLogin = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    Controller.FranchisesLogin(req.body.username, req.body.password)
        .then((userData) => {
            success({ req, res, message: userData })
        })
        .catch(next)
};

const changePass = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    Controller.upsert({
        id: req.body.user.id,
        pass: req.body.password,
        prov: 0,
        usuario: req.body.user.usuario
    }, "")
        .then(data => {
            success({ res, req, message: data })
        })
        .catch(next)
};

const franchiseChangePass = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    Controller.FranchiseChangePass(
        req.body.user,
        req.body.password
    )
        .then(data => {
            success({ res, req, message: data })
        })
        .catch(next)
};

const reqPass = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    Controller.recPass(req.body.email)
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

const franchiseReqPass = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    Controller.franchiseRecPass(req.body.email)
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

router.post("/franchise", franchiseLogin);
router.put("/franchise", secure(), franchiseChangePass);
router.patch("/franchise", franchiseReqPass);
router.post("/", login);
router.put("/", secure(), changePass);
router.patch("/", reqPass);

export = router