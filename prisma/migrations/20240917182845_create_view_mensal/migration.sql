CREATE VIEW media_mensal AS
SELECT
    cod_equipamento,
    DATE_TRUNC('month', data) AS mes,
    AVG("vA") AS media_vA,
    AVG("iA") AS media_iA,
    AVG("potenciaAparenteA") AS media_potenciaAparenteA,
    AVG("potenciaAtivaA") AS media_potenciaAtivaA,
    AVG("FPA") AS media_FPA,
    AVG("vB") AS media_vB,
    AVG("iB") AS media_iB,
    AVG("potenciaAparenteB") AS media_potenciaAparenteB,
    AVG("potenciaAtivaB") AS media_potenciaAtivaB,
    AVG("FPB") AS media_FPB,
    AVG("vC") AS media_vC,
    AVG("iC") AS media_iC,
    AVG("potenciaAparenteC") AS media_potenciaAparenteC,
    AVG("potenciaAtivaC") AS media_potenciaAtivaC,
    AVG("FPC") AS media_FPC
FROM dados_Sensor
GROUP BY cod_equipamento, DATE_TRUNC('month', data);
