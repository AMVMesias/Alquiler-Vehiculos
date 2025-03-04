using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using CapaEntidad;

namespace CapaDatos
{
    public class PagoDAL : BaseDAL
    {
        public List<PagoCLS> ListarPagos()
        {
            return EjecutarListado<PagoCLS>(
                "sp_ListarPagos",
                reader => new PagoCLS
                {
                    Id = Convert.ToInt32(reader["Id"]),
                    ReservaId = Convert.ToInt32(reader["ReservaId"]),
                    Monto = Convert.ToDecimal(reader["Monto"]),
                    MetodoPago = reader["MetodoPago"].ToString(),
                    FechaPago = Convert.ToDateTime(reader["FechaPago"]),
                    Habilitado = Convert.ToBoolean(reader["Habilitado"]),
                    Path = reader["Path"] == DBNull.Value ? null : reader["Path"].ToString(),
                    Descripcion = reader["Descripcion"] == DBNull.Value ? null : reader["Descripcion"].ToString(),
                    ClienteId = Convert.ToInt32(reader["ClienteId"]),
                    VehiculoId = Convert.ToInt32(reader["VehiculoId"]),
                    NombreCliente = reader["NombreCliente"].ToString(),
                    MarcaModeloVehiculo = reader["MarcaModeloVehiculo"].ToString()
                },
                CommandType.StoredProcedure
            );
        }

        public List<PagoCLS> FiltrarPagos(int? reservaId, int? clienteId, string metodoPago, DateTime? fechaDesde, DateTime? fechaHasta)
        {
            List<SqlParameter> parametros = new List<SqlParameter>
            {
                new SqlParameter("@ReservaId", reservaId.HasValue ? (object)reservaId.Value : DBNull.Value),
                new SqlParameter("@ClienteId", clienteId.HasValue ? (object)clienteId.Value : DBNull.Value),
                new SqlParameter("@MetodoPago", !string.IsNullOrEmpty(metodoPago) ? metodoPago : (object)DBNull.Value),
                new SqlParameter("@FechaDesde", fechaDesde.HasValue ? (object)fechaDesde.Value : DBNull.Value),
                new SqlParameter("@FechaHasta", fechaHasta.HasValue ? (object)fechaHasta.Value : DBNull.Value)
            };

            return EjecutarListado<PagoCLS>(
                "sp_FiltrarPagos",
                reader => new PagoCLS
                {
                    Id = Convert.ToInt32(reader["Id"]),
                    ReservaId = Convert.ToInt32(reader["ReservaId"]),
                    Monto = Convert.ToDecimal(reader["Monto"]),
                    MetodoPago = reader["MetodoPago"].ToString(),
                    FechaPago = Convert.ToDateTime(reader["FechaPago"]),
                    Habilitado = Convert.ToBoolean(reader["Habilitado"]),
                    Path = reader["Path"] == DBNull.Value ? null : reader["Path"].ToString(),
                    Descripcion = reader["Descripcion"] == DBNull.Value ? null : reader["Descripcion"].ToString(),
                    ClienteId = Convert.ToInt32(reader["ClienteId"]),
                    VehiculoId = Convert.ToInt32(reader["VehiculoId"]),
                    NombreCliente = reader["NombreCliente"].ToString(),
                    MarcaModeloVehiculo = reader["MarcaModeloVehiculo"].ToString()
                },
                CommandType.StoredProcedure,
                parametros.ToArray()
            );
        }

        public int GuardarDatosPago(PagoCLS objPago)
        {
            List<SqlParameter> parametros = new List<SqlParameter>
            {
                new SqlParameter("@ReservaId", objPago.ReservaId),
                new SqlParameter("@Monto", objPago.Monto),
                new SqlParameter("@MetodoPago", objPago.MetodoPago),
                new SqlParameter("@FechaPago", objPago.FechaPago),
                new SqlParameter("@Path", objPago.Path ?? (object)DBNull.Value),
                new SqlParameter("@Descripcion", objPago.Descripcion ?? (object)DBNull.Value)
            };

            string procedimiento;

            if (objPago.Id == 0)
            {
                // Insertar nuevo pago
                procedimiento = "sp_InsertarPago";
            }
            else
            {
                // Actualizar pago existente
                procedimiento = "sp_ActualizarPago";
                parametros.Add(new SqlParameter("@Id", objPago.Id));
            }

            return EjecutarComandoSQL(procedimiento, CommandType.StoredProcedure, parametros.ToArray());
        }

        public int EliminarPago(int id)
        {
            SqlParameter[] parametros = new SqlParameter[]
            {
                new SqlParameter("@Id", id)
            };

            return EjecutarComandoSQL("sp_EliminarPago", CommandType.StoredProcedure, parametros);
        }

        public PagoCLS ObtenerPagoPorId(int id)
        {
            SqlParameter[] parametros = new SqlParameter[]
            {
                new SqlParameter("@Id", id)
            };

            List<PagoCLS> pagos = EjecutarListado<PagoCLS>(
                "sp_ObtenerPagoPorId",
                reader => new PagoCLS
                {
                    Id = Convert.ToInt32(reader["Id"]),
                    ReservaId = Convert.ToInt32(reader["ReservaId"]),
                    Monto = Convert.ToDecimal(reader["Monto"]),
                    MetodoPago = reader["MetodoPago"].ToString(),
                    FechaPago = Convert.ToDateTime(reader["FechaPago"]),
                    Habilitado = Convert.ToBoolean(reader["Habilitado"]),
                    Path = reader["Path"] == DBNull.Value ? null : reader["Path"].ToString(),
                    Descripcion = reader["Descripcion"] == DBNull.Value ? null : reader["Descripcion"].ToString(),
                    ClienteId = Convert.ToInt32(reader["ClienteId"]),
                    VehiculoId = Convert.ToInt32(reader["VehiculoId"]),
                    NombreCliente = reader["NombreCliente"].ToString(),
                    MarcaModeloVehiculo = reader["MarcaModeloVehiculo"].ToString()
                },
                CommandType.StoredProcedure,
                parametros
            );

            return pagos != null && pagos.Count > 0 ? pagos[0] : null;
        }

        public List<PagoCLS> ObtenerPagosPorReserva(int reservaId)
        {
            SqlParameter[] parametros = new SqlParameter[]
            {
                new SqlParameter("@ReservaId", reservaId)
            };

            return EjecutarListado<PagoCLS>(
                "sp_ObtenerPagosPorReserva",
                reader => new PagoCLS
                {
                    Id = Convert.ToInt32(reader["Id"]),
                    ReservaId = Convert.ToInt32(reader["ReservaId"]),
                    Monto = Convert.ToDecimal(reader["Monto"]),
                    MetodoPago = reader["MetodoPago"].ToString(),
                    FechaPago = Convert.ToDateTime(reader["FechaPago"]),
                    Habilitado = Convert.ToBoolean(reader["Habilitado"]),
                    Path = reader["Path"] == DBNull.Value ? null : reader["Path"].ToString(),
                    Descripcion = reader["Descripcion"] == DBNull.Value ? null : reader["Descripcion"].ToString(),
                    ClienteId = Convert.ToInt32(reader["ClienteId"]),
                    VehiculoId = Convert.ToInt32(reader["VehiculoId"]),
                    NombreCliente = reader["NombreCliente"].ToString(),
                    MarcaModeloVehiculo = reader["MarcaModeloVehiculo"].ToString()
                },
                CommandType.StoredProcedure,
                parametros
            );
        }

        public decimal ObtenerTotalPagadoPorReserva(int reservaId)
        {
            SqlParameter[] parametros = new SqlParameter[]
            {
                new SqlParameter("@ReservaId", reservaId)
            };

            object resultado = EjecutarEscalar("sp_ObtenerTotalPagadoPorReserva", CommandType.StoredProcedure, parametros);
            return resultado != null && resultado != DBNull.Value ? Convert.ToDecimal(resultado) : 0;
        }

        // Método auxiliar para ejecutar consultas escalares
        private object EjecutarEscalar(string comandoTexto, CommandType tipoComando = CommandType.Text, SqlParameter[] parametros = null)
        {
            object resultado = null;
            SqlConnection conn = new SqlConnection(Conexion.GetConnectionString());

            try
            {
                conn.Open();
                using (SqlCommand cmd = new SqlCommand(comandoTexto, conn))
                {
                    cmd.CommandType = tipoComando;
                    if (parametros != null)
                    {
                        cmd.Parameters.AddRange(parametros);
                    }
                    resultado = cmd.ExecuteScalar();
                }
            }
            finally
            {
                if (conn != null && conn.State == ConnectionState.Open)
                {
                    conn.Close();
                }
            }

            return resultado;
        }
    }
}