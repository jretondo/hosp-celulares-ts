import { IJoin } from './../../../interfaces/Ifunctions';
import { ETypesJoin } from './../../../enums/EfunctMysql';
import { IWhereParams } from 'interfaces/Ifunctions';
import { EConcatWhere, EModeWhere } from '../../../enums/EfunctMysql';
import { Tables, Columns } from '../../../enums/EtablesDB';
import StoreType from '../../../store/mysql';

export = (injectedStore: typeof StoreType) => {
  let store = injectedStore;

  const products = async (
    fromDate: string,
    toDate: string,
    pvId?: number,
    idProd?: number,
  ) => {
    let filter: IWhereParams | undefined = undefined;
    let filters: Array<IWhereParams> = [];
    if (pvId) {
      filter = {
        mode: EModeWhere.strict,
        concat: EConcatWhere.none,
        items: [
          {
            column: `${Tables.FACTURAS}.${Columns.facturas.pv}`,
            object: String(pvId),
          },
        ],
      };
      filters.push(filter);
    }

    if (idProd) {
      filter = {
        mode: EModeWhere.strict,
        concat: EConcatWhere.none,
        items: [
          {
            column: `${Tables.DET_FACTURAS}.${Columns.detallesFact.id_prod}`,
            object: String(idProd),
          },
        ],
      };
      filters.push(filter);
    }

    filter = {
      mode: EModeWhere.higherEqual,
      concat: EConcatWhere.none,
      items: [
        {
          column: `${Tables.FACTURAS}.${Columns.facturas.fecha}`,
          object: String(fromDate),
        },
      ],
    };
    filters.push(filter);

    filter = {
      mode: EModeWhere.lessEqual,
      concat: EConcatWhere.none,
      items: [
        {
          column: `${Tables.FACTURAS}.${Columns.facturas.fecha}`,
          object: String(toDate),
        },
      ],
    };
    filters.push(filter);

    const join: IJoin = {
      table: Tables.DET_FACTURAS,
      colJoin: Columns.detallesFact.fact_id,
      colOrigin: Columns.facturas.id,
      type: ETypesJoin.left,
    };

    const group: Array<string> = [
      `${Tables.FACTURAS}.${Columns.facturas.fecha}`,
    ];

    const data = await store.list(
      Tables.FACTURAS,
      [
        `SUM(${Tables.DET_FACTURAS}.${Columns.detallesFact.total_prod}) AS totalVenta`,
        `SUM(${Tables.DET_FACTURAS}.${Columns.detallesFact.total_costo}) AS totalCosto`,
        `SUM(${Tables.DET_FACTURAS}.${Columns.detallesFact.total_prod} - ${Tables.DET_FACTURAS}.${Columns.detallesFact.total_costo}) AS totalGanancia`,
        `COUNT(${Tables.DET_FACTURAS}.${Columns.detallesFact.id}) AS cantidad`,
        `(${Tables.FACTURAS}.${Columns.facturas.fecha}) AS fecha`,
      ],
      filters,
      group,
      undefined,
      [join],
    );
    return {
      data,
    };
  };

  return {
    products,
  };
};
