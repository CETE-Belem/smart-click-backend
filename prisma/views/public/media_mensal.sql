SELECT
  date_trunc('month' :: text, dados_sensor.data) AS mes,
  avg(dados_sensor."vA") AS media_va,
  avg(dados_sensor."iA") AS media_ia,
  avg(dados_sensor."potenciaAparenteA") AS media_potenciaaparentea,
  avg(dados_sensor."potenciaAtivaA") AS media_potenciaativaa,
  avg(dados_sensor."FPA") AS media_fpa,
  avg(dados_sensor."vB") AS media_vb,
  avg(dados_sensor."iB") AS media_ib,
  avg(dados_sensor."potenciaAparenteB") AS media_potenciaaparenteb,
  avg(dados_sensor."potenciaAtivaB") AS media_potenciaativab,
  avg(dados_sensor."FPB") AS media_fpb,
  avg(dados_sensor."vC") AS media_vc,
  avg(dados_sensor."iC") AS media_ic,
  avg(dados_sensor."potenciaAparenteC") AS media_potenciaaparentec,
  avg(dados_sensor."potenciaAtivaC") AS media_potenciaativac,
  avg(dados_sensor."FPC") AS media_fpc
FROM
  dados_sensor
GROUP BY
  (date_trunc('month' :: text, dados_sensor.data));