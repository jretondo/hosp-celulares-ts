enum AdminCol {
    id = 'id',
    nombre = 'nombre',
    apellido = 'apellido',
    email = 'email',
    usuario = 'usuario',
    pv = 'pv',
    cash_date = "cash_date",
    cash_found = "cash_found"
}

enum CashWithdrawal {
    id = "id",
    date_time = "date_time",
    amount = "amount",
    admin_id = "admin_id",
    pv_id = "pv_id",
    detail = "detail"
}

enum AuthAdmCol {
    id = 'id',
    usuario = 'usuario',
    pass = 'pass',
    prov = 'prov'
}

enum UserPermissionCol {
    id = "id",
    id_user = "id_user",
    id_permission = "id_permission"
}

enum PtosVta {
    id = "id",
    cuit = "cuit",
    raz_soc = "raz_soc",
    pv = "pv",
    carpeta_crt = "carpeta_crt",
    direccion = "direccion",
    nom_fantasia = "nom_fantasia",
    iibb = "iibb",
    cond_iva = "cond_iva",
    aviso_limite = "aviso_limite",
    logo_bool = "logo_bool",
    logo_img = "logo_img",
    ini_act = "ini_act",
    cat_mono = "cat_mono",
    stock_ind = "stock_ind"
}

enum ProductosPrincipal {
    id = "id",
    fecha_carga = "fecha_carga",
    cod_barra = "cod_barra",
    name = "name",
    short_decr = "short_descr",
    enabled = "enabled",
    category = "category",
    subcategory = "subcategory",
    unidad = "unidad",
    precio_compra = "precio_compra",
    porc_minor = "porc_minor",
    discount = "discount",
    round = "round",
    iva = "iva",
    id_prov = "id_prov",
    vta_price = "vta_price",
    vta_fija = "vta_fija"
}

enum ProductsImg {
    id = "id",
    id_prod = "id_prod",
    url_img = "url_img"
}

enum ProductsTag {
    id = "id",
    id_prod = "id_prod",
    tag = "tag"
}

enum Proveedores {
    id = "id",
    cuit = "cuit",
    ndoc = "ndoc",
    razsoc = "razsoc",
    telefono = "telefono",
    email = "email",
    cond_iva = "cond_iva",
    fantasia = "fantasia",
    obs = "obs",
    keyword = "keyword"
}

enum Clientes {
    id = "id",
    cuit = "cuit",
    ndoc = "ndoc",
    razsoc = "razsoc",
    telefono = "telefono",
    email = "email",
    cond_iva = "cond_iva"
}

enum Permissions {
    id = "id",
    module_name = "module_name"
}

enum Stock {
    id = "id",
    fecha = "fecha",
    id_prod = "id_prod",
    pv_id = "pv_id",
    cant = "cant",
    venta = "venta",
    nro_remito = "nro_remito",
    costo = "costo",
    iva = "iva",
    id_user = "id_user",
    id_fact = "id_fact",
    prod_name = "prod_name",
    pv_descr = "pv_descr",
    category = "category",
    sub_category = "sub_category"
}

enum Facturas {
    id = "id",
    fecha = "fecha",
    pv = "pv",
    cbte = "cbte",
    letra = "letra",
    cae = "cae",
    vto_cae = "vto_cae",
    t_fact = "t_fact",
    cuit_origen = "cuit_origen",
    iibb_origen = "iibb_origen",
    ini_act_origen = "ini_act_origen",
    direccion_origen = "direccion_origen",
    raz_soc_origen = "raz_soc_origen",
    cond_iva_origen = "cond_iva_origen",
    tipo_doc_cliente = "tipo_doc_cliente",
    n_doc_cliente = "n_doc_cliente",
    cond_iva_cliente = "cond_iva_cliente",
    email_cliente = "email_cliente",
    nota_cred = "nota_cred",
    fiscal = "fiscal",
    raz_soc_cliente = "raz_soc_cliente",
    user_id = "user_id",
    seller_name = "seller_name",
    total_fact = "total_fact",
    total_iva = "total_iva",
    total_neto = "total_neto",
    total_compra = "total_compra",
    forma_pago = "forma_pago",
    pv_id = "pv_id",
    id_fact_asoc = "id_fact_asoc",
    create_time = "create_time",
    det_rbo = "det_rbo"
}

enum DetalleFact {
    id = "id",
    created_time = "created_time",
    fact_id = "fact_id",
    id_prod = "id_prod",
    nombre_prod = "nombre_prod",
    cant_prod = "cant_prod",
    unidad_tipo_prod = "unidad_tipo_prod",
    total_prod = "total_prod",
    total_iva = "total_iva",
    total_costo = "total_costo",
    total_neto = "total_neto",
    alicuota_id = "alicuota_id",
    precio_ind = "precio_ind"
}

enum CtaCte {
    id = "id",
    fecha = "fecha",
    id_cliente = "id_cliente",
    id_factura = "id_factura",
    id_recibo = "id_recibo",
    forma_pago = "forma_pago",
    importe = "importe",
    detalle = "detalle"
}

enum FormasPago {
    id = "id",
    id_fact = "id_fact",
    tipo = "tipo",
    importe = "importe"
}

enum Franchise {
    id = "id",
    f_user = "f_user",
    pass = "pass",
    email = "email",
    name = "name",
    direction = "direction",
    obs = "obs",
    phone = "phone",
    provisory_pass = "provisory_pass "
}

enum Repairs {
    id = "id",
    date = "date",
    detail = "detail",
    client = "client",
    part_cost = "part_cost",
    service_cost = "service_cost",
    final_price = "final_price",
    hpc_cost = "hpc_cost",
    state = "state",
    pv_id = "pv_id",
    user_reg = "user_reg",
    difference = "difference"
}

enum PaymentsRepairs {
    id = "id",
    date = "date",
    detail = "detail",
    repair_id = "repair_id",
    type = "type",
    amount = "amount"
}

enum PartsAccesories {
    id = "id",
    created_time = "created_time",
    last_updated = "last_updated",
    color = "color",
    model = "model",
    observations = "observations",
    type_id = "type_id",
    pv_id = "pv_id",
    state_id = "state_id",
    user_id = "user_id"
}

enum PartAccesoryStates {
    id = "id",
    state = "state",
    color = "color"
}

enum PartAccesoryTypes {
    id = "id",
    type = "type"
}

enum PuntosVentaUsuarios {
    id = "id",
    usuario_id = "usuario_id",
    pv_id = "pv_id"
}

export enum MetodosPago {
    efectivo = 0,
    mercaPago = 1,
    debito = 2,
    credito = 3,
    ctaCte = 4,
    varios = 5
}

export enum Tables {
    ADMIN = "administradores",
    AUTH_ADMIN = "auth_admin",
    USER_PERMISSIONS = "admin_permissions",
    PUNTOS_VENTA = "puntos_venta",
    PRODUCTS_PRINCIPAL = "products_principal",
    PRODUCTS_IMG = "products_img",
    PRODUCTS_TAGS = "produscts_tags",
    PROVEEDORES = "proveedores",
    CLIENTES = "clientes",
    PERMISSIONS = "permissions",
    STOCK = "stock",
    FACTURAS = "facturas",
    DET_FACTURAS = "detalle_fact",
    CTA_CTE = "cta_cte",
    FORMAS_PAGO = "formas_pago",
    FRANCHISE = "franchise",
    REPAIRS = "repairs",
    PAYMENTS_REPAIRS = "payments_repairs",
    PARTS_ACCESSORIES = "parts_accesories",
    PART_ACCESSORY_STATES = "part_accesory_states",
    PART_ACCESSORY_TYPES = "part_accesory_types",
    CASH_WITHDRAWAL = "cash_withdrawal",
    PUNTOS_VENTA_USUARIO = "puntos_venta_usuarios"
}

export const Columns = {
    admin: AdminCol,
    authAdmin: AuthAdmCol,
    userPemissions: UserPermissionCol,
    ptosVta: PtosVta,
    prodPrincipal: ProductosPrincipal,
    prodImg: ProductsImg,
    prodTags: ProductsTag,
    proveedores: Proveedores,
    clientes: Clientes,
    permissions: Permissions,
    stock: Stock,
    facturas: Facturas,
    detallesFact: DetalleFact,
    ctaCte: CtaCte,
    formasPago: FormasPago,
    franchise: Franchise,
    repairs: Repairs,
    paymentsRepairs: PaymentsRepairs,
    partsAccessories: PartsAccesories,
    partAccessoryStates: PartAccesoryStates,
    partAccessoryTypes: PartAccesoryTypes,
    cashWithdrawal: CashWithdrawal,
    puntosVentaUsuarios: PuntosVentaUsuarios
}