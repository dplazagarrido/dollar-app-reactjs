import React, { useState, useEffect } from 'react'
import appisSbif from '../../utils/axiosInstances'
import { sbifApiKey } from '../../utils/apiKey'
import  { Grid } from '@material-ui/core'
import DateFnsUtils from '@date-io/date-fns'
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from '@material-ui/pickers'
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts'
import CircularProgress from '@material-ui/core/CircularProgress'


const DollarChart = () =>  {
  

  const [selectedDateIni, setSelectDateIni] = useState(null)
  const [selectedDateFin, setSelectDateFin] = useState(new Date())
  const [data, setData] = useState(null)
  const [maxValue, setMaxValue] = useState(null)
  const [minValue, setMinValue] = useState(null)
  const [avgValue, setAvgValue] = useState(null)
  const [codeError, setCodeError] = useState(null)
  const [showLoading, setShowLoading] = useState(false)
  const [showWelcome, setShowWelcome] = useState(true)

  useEffect(() => {
    const getDollarInfo = async () => {
      try {
        setShowLoading(true)
        const response = await appisSbif.get(`/dolar/periodo/${selectedDateIni.getFullYear()}/${selectedDateIni.getMonth() + 1}/dias_i/${selectedDateIni.getDate()}/${selectedDateFin.getFullYear()}/${selectedDateFin.getMonth() + 1}/dias_f/${selectedDateFin.getDate()}?apikey=${sbifApiKey}&formato=json`)
        const dataTemp = []
        const valoresTemp = []
        response.data.Dolares.forEach(element => {
          dataTemp.push({
            Fecha: element.Fecha,
            'Valor Dolar': parseInt(element.Valor),
          })
          valoresTemp.push(parseInt(element.Valor))
        });
        setData(dataTemp)
        setMaxValue(Math.max(...valoresTemp))
        setMinValue(Math.min(...valoresTemp))
        setAvgValue((valoresTemp.reduce((a,b) => a + b, 0) / valoresTemp.length).toFixed(2))
        setCodeError(null)
        setShowLoading(false)
        setShowWelcome(false)
      } catch (error) {
          setCodeError(0)
      }
    }
    if(selectedDateIni !== null){
      getDollarInfo()
    }
  }, [selectedDateIni, selectedDateFin])

    return (
      <div className="container">
        <MuiPickersUtilsProvider utils={DateFnsUtils}>
          <Grid container justify="space-around">
            <KeyboardDatePicker
              disableToolbar
              variant="inline"
              format="dd/MM/yyyy"
              margin="normal"
              id="date-picker-inline"
              label="Seleccione Fecha Inicio"
              value= {selectedDateIni}
              onChange= {setSelectDateIni}
              maxDate={selectedDateFin}
              KeyboardButtonProps={{
                'aria-label': 'change date',
              }}
            />
            <KeyboardDatePicker
              disableToolbar
              variant="inline"
              format="dd/MM/yyyy"
              margin="normal"
              id="date-picker-inline"
              label="Seleccione Fecha Fin"
              value= {selectedDateFin}
              onChange= {setSelectDateFin}
              maxDate={new Date()}
              minDate={selectedDateIni}
              KeyboardButtonProps={{
                'aria-label': 'change date',
              }}
            />
          </Grid>
        </MuiPickersUtilsProvider>
        {codeError === 0 && <label>Oops! Ha ocurrido un error, por favor reintenta nuevamente</label>}
        {showWelcome && <div>
          <label>Bienvenid@!</label>
          <p></p>
          <label>Esta es una App para consultar el valor del dolar entre dos fechas</label>
          <p></p>
          <label>Para comenzar selecciona una fecha de inicio y fin</label>
          <p></p>
        </div>}
        {showLoading && <CircularProgress/>}
        {data && <div>
          <p></p>
          <label>El valor máximo del dólar: {maxValue}</label>
          <p></p>
          <label>El valor mínimo del dólar: {minValue}</label>
          <p></p>
          <label>El valor promedio: {avgValue}</label>
          <p></p>
          <ResponsiveContainer width='100%' aspect={4.0/1.5}>
            <LineChart
              width={100}
              height={100}
              data={data}
              margin={{
                top: 5, right: 30, left: 20, bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="Fecha" />
              <YAxis dataKey="Valor Dolar" label={{ value: 'Valor Dolar (CLP)', angle: -90, position: 'insideLeft' }}/>
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="Valor Dolar" stroke="#8884d8" activeDot={{ r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>}
      </div>
    )
}

export default DollarChart

