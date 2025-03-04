using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using CapaEntidad;

namespace CapaDatos
{
    public class SeguroDAL : BaseDAL
    {
        public List<SeguroCLS> ListarSeguros()
        {
            return EjecutarListado<SeguroCLS>(
                "sp_ListarSeguros",
                reader => new SeguroCLS
                {
                    Id = Convert.ToInt32(reader["Id"]),
                    ReservaId = Convert.ToInt32(reader["ReservaId"]),
                    TipoSeguro = reader["TipoSeguro"].ToString(),
                    Costo = Convert.ToDecimal(reader["Costo"]),
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

        public List<SeguroCLS> FiltrarSeguros(int? reservaId, int? clienteId, string tipoSeguro)
        {
            List<SqlParameter> parametros = new List<SqlParameter>
            {
                new SqlParameter("@ReservaId", reservaId.HasValue ? (object)reservaId.Value : DBNull.Value),
                new SqlParameter("@ClienteId", clienteId.HasValue ? (object)clienteId.Value : DBNull.Value),
                new SqlParameter("@TipoSeguro", !string.IsNullOrEmpty(tipoSeguro) ? tipoSeguro : (object)DBNull.Value)
            };

            return EjecutarListado<SeguroCLS>(
                "sp_FiltrarSeguros",
                reader => new SeguroCLS
                {
                    Id = Convert.ToInt32(reader["Id"]),
                    ReservaId = Convert.ToInt32(reader["ReservaId"]),
                    TipoSeguro = reader["TipoSeguro"].ToString(),
                    Costo = Convert.ToDecimal(reader["Costo"]),
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

        public int GuardarDatosSeguro(SeguroCLS objSeguro)
        {
            List<SqlParameter> parametros = new List<SqlParameter>
            {
                new SqlParameter("@ReservaId", objSeguro.ReservaId),
                new SqlParameter("@TipoSeguro", objSeguro.TipoSeguro),
                new SqlParameter("@Costo", objSeguro.Costo),
                new SqlParameter("@Path", objSeguro.Path ?? (object)DBNull.Value),
                new SqlParameter("@Descripcion", objSeguro.Descripcion ?? (object)DBNull.Value)
            };

            string procedimiento;

            if (objSeguro.Id == 0)
            {
                // Insertar nuevo seguro
                procedimiento = "sp_InsertarSeguro";
            }
            else
            {
                // Actualizar seguro existente
                procedimiento = "sp_ActualizarSeguro";
                parametros.Add(new SqlParameter("@Id", objSeguro.Id));
            }

            return EjecutarComandoSQL(procedimiento, CommandType.StoredProcedure, parametros.ToArray());
        }

        public int EliminarSeguro(int id)
        {
            SqlParameter[] parametros = new SqlParameter[]
            {
                new SqlParameter("@Id", id)
            };

            return EjecutarComandoSQL("sp_EliminarSeguro", CommandType.StoredProcedure, parametros);
        }

        public SeguroCLS ObtenerSeguroPorId(int id)
        {
            SqlParameter[] parametros = new SqlParameter[]
            {
                new SqlParameter("@Id", id)
            };

            List<SeguroCLS> seguros = EjecutarListado<SeguroCLS>(
                "sp_ObtenerSeguroPorId",
                reader => new SeguroCLS
                {
                    Id = Convert.ToInt32(reader["Id"]),
                    ReservaId = Convert.ToInt32(reader["ReservaId"]),
                    TipoSeguro = reader["TipoSeguro"].ToString(),
                    Costo = Convert.ToDecimal(reader["Costo"]),
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

            return seguros != null && seguros.Count > 0 ? seguros[0] : null;
        }

        public List<SeguroCLS> ObtenerSegurosPorReserva(int reservaId)
        {
            SqlParameter[] parametros = new SqlParameter[]
            {
                new SqlParameter("@ReservaId", reservaId)
            };

            return EjecutarListado<SeguroCLS>(
                "sp_ObtenerSegurosPorReserva",
                reader => new SeguroCLS
                {
                    Id = Convert.ToInt32(reader["Id"]),
                    ReservaId = Convert.ToInt32(reader["ReservaId"]),
                    TipoSeguro = reader["TipoSeguro"].ToString(),
                    Costo = Convert.ToDecimal(reader["Costo"]),
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

        public decimal ObtenerTotalCostoSegurosPorReserva(int reservaId)
        {
            SqlParameter[] parametros = new SqlParameter[]
            {
                new SqlParameter("@ReservaId", reservaId)
            };

            object resultado = EjecutarEscalar("sp_ObtenerTotalCostoSegurosPorReserva", CommandType.StoredProcedure, parametros);
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