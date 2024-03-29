import { Router, NextFunction, Response, Request } from 'express';
import { file, success } from '../../../network/response';
const router = Router();
import Controller from './index';
import secure from '../../../auth/secure';
import { EPermissions } from '../../../enums/EfunctMysql';
import factuMiddel from '../../../utils/facturacion/middleFactu';
import { fiscalMiddle } from '../../../utils/facturacion/middleFiscal';
import { invoicePDFMiddle } from '../../../utils/facturacion/middlePDFinvoice';
import { sendFactMiddle } from '../../../utils/facturacion/middleSendFact';
import dataFactMiddle from '../../../utils/facturacion/middleDataFact';
import devFactMiddle from '../../../utils/facturacion/middleDevFact';

const list = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    Controller.list(
        Number(req.query.pvId),
        Number(req.query.fiscal),
        Number(req.query.cbte),
        Number(req.params.page),
        String(req.query.search),
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
};

const get = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    Controller.get(Number(req.params.id))
        .then((data) => {
            success({ req, res, message: data });
        })
        .catch(next)
};

const getLast = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    Controller.lastInvoice(Number(req.query.pvId), Boolean(req.query.fiscal), Number(req.query.tipo), Boolean(req.query.entorno))
        .then((data) => {
            success({ req, res, message: data });
        })
        .catch(next)
};

const newInvoice = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    Controller.newInvoice(req.body.pvData, req.body.newFact, req.body.dataFiscal, req.body.productsList, req.body.fileName, req.body.filePath, req.body.timer, req.body.user, req.body.variosPagos, next)
        .then((dataFact) => {
            file(req, res, dataFact.filePath, 'application/pdf', dataFact.fileName, dataFact);
        })
        .catch(next)
};

const getDataFactPDF = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    if (req.query.sendEmail) {
        success({ req, res })
    } else {
        Controller.getDataFact(req.body.fileName, req.body.filePath)
            .then(dataFact => {
                file(req, res, dataFact.filePath, 'application/pdf', dataFact.fileName, dataFact);
            })
            .catch(next)
    }
};

const getFiscalDataInvoice = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    Controller.getFiscalDataInvoice(
        Number(req.query.ncbte),
        Number(req.query.pvId),
        Boolean(req.query.fiscal),
        Number(req.query.tipo),
        Boolean(req.query.entorno)
    )
        .then((data) => {
            success({ req, res, message: data });
        })
        .catch(next)
};

const cajaList = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    Controller.cajaList(
        false,
        String(req.query.desde),
        String(req.query.hasta),
        Number(req.query.ptoVta),
        Number(req.query.userId),
        Number(req.params.page),
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

const cajaListPDF = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    Controller.cajaList(
        true,
        String(req.query.desde),
        String(req.query.hasta),
        Number(req.query.ptoVta),
        Number(req.query.userId),
    )
        .then((dataFact) => {
            file(req, res, dataFact.filePath, 'application/pdf', dataFact.fileName, dataFact);
        })
        .catch(next)
};

const changePayType = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    Controller.changePayType(Number(req.params.id), req.body.idType)
        .then((data) => {
            success({ req, res, message: data });
        })
        .catch(next)
}

const getDummy = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    Controller.dummyServers(
        String(req.query.certFile),
        String(req.query.keyFile),
        Number(req.query.cuit)).then(data => {
            success({ req, res, message: data });
        }).catch(next)
}

const timeoutProuf = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    setTimeout(() => {
        success({ req, res, message: "ok" })
    }, 5000);
}

const correctorNC = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    Controller.correctorNC().then(data => {
        success({ req, res, message: data });
    }).catch(next)
}

const getCashFound = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    Controller.getCashFound(req.body.user.id).then(data => {
        success({ req, res, message: data });
    }).catch(next)
}

const newCashFound = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    Controller.putCashFound(req.body.user.id, req.body.cashFound, req.body.cashDate).then(data => {
        success({ req, res });
    }).catch(next)
}

const newCashWithdrawal = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    Controller.newCashWithdrawal(req.body.user.id, req.body.pvId, req.body.amount, req.body.detail).then(() => {
        success({ req, res, status: 201 });
    }).catch(next)
}

const getTotalCashWithdrawal = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    Controller.getTotalCashWithdrawal(String(req.query.fromDate), String(req.query.toDate), req.body.user.id, Number(req.query.pvId)).then((data) => {
        success({ req, res, message: data });
    }).catch(next)
}


router.get("/details/:id", secure(EPermissions.ventas), get)
    .get("/cajaList/:page", secure(EPermissions.ventas), cajaList)
    .get("/cajaListPDF", secure(EPermissions.ventas), cajaListPDF)
    .get("/factDataPDF/:id", secure(EPermissions.ventas), dataFactMiddle(), invoicePDFMiddle(), sendFactMiddle(), getDataFactPDF)
    .get("/last", secure(EPermissions.ventas), getLast)
    .get("/dummy", secure(EPermissions.ventas), getDummy)
    .get("/timeout", secure(EPermissions.ventas), timeoutProuf)
    .get("/afipData", secure(EPermissions.ventas), getFiscalDataInvoice)
    .get("/cashFound", secure(EPermissions.ventas), getCashFound)
    .put("/cashFound", secure(EPermissions.ventas), newCashFound)
    .get("/cashWithdrawal", secure(EPermissions.ventas), getTotalCashWithdrawal)
    .post("/cashWithdrawal", secure(EPermissions.ventas), newCashWithdrawal)
    .post("/notaCred", secure(EPermissions.ventas), devFactMiddle(), fiscalMiddle(), invoicePDFMiddle(), sendFactMiddle(), newInvoice)
    .put("/paytype/:id", secure(EPermissions.ventas), changePayType)
    .delete("/:id", secure(EPermissions.ventas), remove)
    .get("/:page", secure(EPermissions.ventas), list)
    .post("/", secure(EPermissions.ventas), factuMiddel(), fiscalMiddle(), invoicePDFMiddle(), sendFactMiddle(), newInvoice)

export = router;