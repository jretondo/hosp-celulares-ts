import { Router, NextFunction, Response, Request } from 'express';
import { file, success } from '../../../network/response';
const router = Router();
import Controller from './index';
import secure from '../../../auth/secure';
import { EPermissions } from '../../../enums/EfunctMysql';

const products = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    Controller.products(
        String(req.query.fromDate),
        String(req.query.toDate),
        Number(req.query.pvId),
        Number(req.query.prodId)
    )
        .then((data: any) => {
            success({
                req,
                res,
                status: 200,
                message: data
            });
        })
        .catch(next)
};

router
    .get("/products", secure(), products)

export = router;