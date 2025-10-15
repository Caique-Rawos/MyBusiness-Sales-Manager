from fastapi import FastAPI
from pydantic import BaseModel
from typing import List
import pandas as pd
from prophet import Prophet

app = FastAPI(title="Previsão de Vendas")

class Venda(BaseModel):
    mes: str          # formato 'MM-YYYY'
    valorTotal: float
    quantidadeVendas: int

class Vendas(BaseModel):
    vendas: List[Venda]

@app.post("/forecast")
def forecast(data: Vendas):
    # Converter dados em DataFrame
    df = pd.DataFrame([v.dict() for v in data.vendas])

    # Corrigir formato de data: 'MM-YYYY' -> 'YYYY-MM'
    df['ds'] = pd.to_datetime(df['mes'].apply(lambda x: f"{x[3:]}-{x[:2]}-01"))

    # Último mês do histórico
    ultimo_mes = df['ds'].max()

    # ===== Modelo 1: valorTotal =====
    df_total = df[['ds', 'valorTotal']].rename(columns={'valorTotal': 'y'})
    modelo_total = Prophet()
    modelo_total.fit(df_total)
    futuro_total = modelo_total.make_future_dataframe(periods=4, freq='M')
    previsao_total = modelo_total.predict(futuro_total)

    previsoes_total = previsao_total[
        previsao_total['ds'].dt.to_period('M') > ultimo_mes.to_period('M')
    ][['ds', 'yhat']].head(3)

    # ===== Modelo 2: quantidadeVendas =====
    df_qtd = df[['ds', 'quantidadeVendas']].rename(columns={'quantidadeVendas': 'y'})
    modelo_qtd = Prophet()
    modelo_qtd.fit(df_qtd)
    futuro_qtd = modelo_qtd.make_future_dataframe(periods=4, freq='M')
    previsao_qtd = modelo_qtd.predict(futuro_qtd)

    previsoes_qtd = previsao_qtd[
        previsao_qtd['ds'].dt.to_period('M') > ultimo_mes.to_period('M')
    ][['ds', 'yhat']].head(3)

    # ===== Montar resposta =====
    resultado = []
    for i in range(len(previsoes_total)):
        resultado.append({
            "mes": previsoes_total.iloc[i]['ds'].strftime('%m-%Y'),
            "valorTotal": float(previsoes_total.iloc[i]['yhat']),
            "quantidadeVendas": int(round(previsoes_qtd.iloc[i]['yhat'])),
            "isPrevisao": True
        })

    return resultado
