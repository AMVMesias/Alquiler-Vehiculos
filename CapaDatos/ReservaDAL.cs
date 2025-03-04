using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using CapaEntidad;

namespace CapaDatos
{
    public class ReservaDAL : BaseDAL
    {
        public List<ReservaCLS> ListarReservas()
        {
            return EjecutarListado<ReservaCLS>(
                "sp_ListarReservas",
                reader => new ReservaCLS
                {
                    Id = Convert.ToInt32(reader["Id"]),
                    ClienteId = Convert.ToInt32(reader["ClienteId"]),
                    VehiculoId = Convert.ToInt32(reader["VehiculoId"]),
                    FechaInicio = Convert.ToDateTime(reader["FechaInicio"]),
                    FechaFin = Convert.ToDateTime(reader["FechaFin"]),
                    Estado = reader["Estado"].ToString(),
                    Habilitado = Convert.ToBoolean(reader["Habilitado"]),
                    Path = reader["Path"] == DBNull.Value ? null : reader["Path"].ToString(),
                    Descripcion = reader["Descripcion"] == DBNull.Value ? null : reader["Descripcion"].ToString(),
                    NombreCliente = reader["NombreCliente"].ToString(),
                    MarcaModeloVehiculo = reader["MarcaModeloVehiculo"].ToString()
                },
                CommandType.StoredProcedure
            );
        }

        public List<ReservaCLS> FiltrarReservas(int? clienteId, int? vehiculoId, DateTime? fechaInicio, DateTime? fechaFin, string estado)
        {
            List<SqlParameter> parametros = new List<SqlParameter>();

            parametros.Add(new SqlParameter("@ClienteId", clienteId.HasValue ? (object)clienteId.Value : DBNull.Value));
            parametros.Add(new SqlParameter("@VehiculoId", vehiculoId.HasValue ? (object)vehiculoId.Value : DBNull.Value));
            parametros.Add(new SqlParameter("@FechaInicio", fechaInicio.HasValue ? (object)fechaInicio.Value : DBNull.Value));
            parametros.Add(new SqlParameter("@FechaFin", fechaFin.HasValue ? (object)fechaFin.Value : DBNull.Value));
            parametros.Add(new SqlParameter("@Estado", string.IsNullOrEmpty(estado) ? DBNull.Value : (object)estado));

            return EjecutarListado<ReservaCLS>(
                "sp_FiltrarReservas",
                reader => new ReservaCLS
                {
                    Id = Convert.ToInt32(reader["Id"]),
                    ClienteId = Convert.ToInt32(reader["ClienteId"]),
                    VehiculoId = Convert.ToInt32(reader["VehiculoId"]),
                    FechaInicio = Convert.ToDateTime(reader["FechaInicio"]),
                    FechaFin = Convert.ToDateTime(reader["FechaFin"]),
                    Estado = reader["Estado"].ToString(),
                    Habilitado = Convert.ToBoolean(reader["Habilitado"]),
                    Path = reader["Path"] == DBNull.Value ? null : reader["Path"].ToString(),
                    Descripcion = reader["Descripcion"] == DBNull.Value ? null : reader["Descripcion"].ToString(),
                    NombreCliente = reader["NombreCliente"].ToString(),
                    MarcaModeloVehiculo = reader["MarcaModeloVehiculo"].ToString()
                },
                CommandType.StoredProcedure,
                parametros.ToArray()
            );
        }

        public bool VerificarDisponibilidadVehiculo(int vehiculoId, DateTime fechaInicio, DateTime fechaFin, int? reservaId = null)
        {
            List<SqlParameter> parametros = new List<SqlParameter>
            {
                new SqlParameter("@VehiculoId", vehiculoId),
                new SqlParameter("@FechaInicio", fechaInicio),
                new SqlParameter("@FechaFin", fechaFin),
                new SqlParameter("@ReservaIdActual", reservaId.HasValue ? (object)reservaId.Value : DBNull.Value)
            };

            // Suponiendo que tienes un método para ejecutar un escalar (devuelve un valor único)
            // Si no lo tienes, puedes usar EjecutarComandoSQL y procesar el valor de retorno
            int disponible = 0;
            SqlConnection conn = new SqlConnection(Conexion.GetConnectionString());

            try
            {
                conn.Open();
                using (SqlCommand cmd = new SqlCommand("sp_VerificarDisponibilidadVehiculo", conn))
                {
                    cmd.CommandType = CommandType.StoredProcedure;

                    foreach (var param in parametros)
                    {
                        cmd.Parameters.Add(param);
                    }

                    disponible = Convert.ToInt32(cmd.ExecuteScalar());
                }
            }
            catch
            {
                disponible = 0; // En caso de error, asumimos que no está disponible
            }
            finally
            {
                if (conn.State == ConnectionState.Open)
                {
                    conn.Close();
                }
                conn.Dispose();
            }

            return disponible == 1;
        }

        public int GuardarDatosReserva(ReservaCLS objReserva)
        {
            List<SqlParameter> parametros = new List<SqlParameter>
            {
                new SqlParameter("@ClienteId", objReserva.ClienteId),
                new SqlParameter("@VehiculoId", objReserva.VehiculoId),
                new SqlParameter("@FechaInicio", objReserva.FechaInicio),
                new SqlParameter("@FechaFin", objReserva.FechaFin),
                new SqlParameter("@Estado", objReserva.Estado),
                new SqlParameter("@Path", objReserva.Path ?? (object)DBNull.Value),
                new SqlParameter("@Descripcion", objReserva.Descripcion ?? (object)DBNull.Value)
            };

            string procedimiento;

            if (objReserva.Id == 0)
            {
                // Insertar nueva reserva
                procedimiento = "sp_InsertarReserva";
            }
            else
            {
                // Actualizar reserva existente
                procedimiento = "sp_ActualizarReserva";
                parametros.Add(new SqlParameter("@Id", objReserva.Id));
            }

            return EjecutarComandoSQL(procedimiento, CommandType.StoredProcedure, parametros.ToArray());
        }

        public int EliminarReserva(int id)
        {
            SqlParameter[] parametros = new SqlParameter[]
            {
                new SqlParameter("@Id", id)
            };

            return EjecutarComandoSQL("sp_EliminarReserva", CommandType.StoredProcedure, parametros);
        }

        public ReservaCLS ObtenerReservaPorId(int id)
        {
            SqlParameter[] parametros = new SqlParameter[]
            {
                new SqlParameter("@Id", id)
            };

            List<ReservaCLS> reservas = EjecutarListado<ReservaCLS>(
                "sp_ObtenerReservaPorId",
                reader => new ReservaCLS
                {
                    Id = Convert.ToInt32(reader["Id"]),
                    ClienteId = Convert.ToInt32(reader["ClienteId"]),
                    VehiculoId = Convert.ToInt32(reader["VehiculoId"]),
                    FechaInicio = Convert.ToDateTime(reader["FechaInicio"]),
                    FechaFin = Convert.ToDateTime(reader["FechaFin"]),
                    Estado = reader["Estado"].ToString(),
                    Habilitado = Convert.ToBoolean(reader["Habilitado"]),
                    Path = reader["Path"] == DBNull.Value ? null : reader["Path"].ToString(),
                    Descripcion = reader["Descripcion"] == DBNull.Value ? null : reader["Descripcion"].ToString(),
                    NombreCliente = reader["NombreCliente"].ToString(),
                    MarcaModeloVehiculo = reader["MarcaModeloVehiculo"].ToString()
                },
                CommandType.StoredProcedure,
                parametros
            );

            return reservas != null && reservas.Count > 0 ? reservas[0] : null;
        }

        public List<ReservaCLS> ListarReservasPorCliente(int clienteId)
        {
            SqlParameter[] parametros = new SqlParameter[]
            {
                new SqlParameter("@ClienteId", clienteId)
            };

            return EjecutarListado<ReservaCLS>(
                "sp_ListarReservasPorCliente",
                reader => new ReservaCLS
                {
                    Id = Convert.ToInt32(reader["Id"]),
                    ClienteId = Convert.ToInt32(reader["ClienteId"]),
                    VehiculoId = Convert.ToInt32(reader["VehiculoId"]),
                    FechaInicio = Convert.ToDateTime(reader["FechaInicio"]),
                    FechaFin = Convert.ToDateTime(reader["FechaFin"]),
                    Estado = reader["Estado"].ToString(),
                    Habilitado = Convert.ToBoolean(reader["Habilitado"]),
                    Path = reader["Path"] == DBNull.Value ? null : reader["Path"].ToString(),
                    Descripcion = reader["Descripcion"] == DBNull.Value ? null : reader["Descripcion"].ToString(),
                    NombreCliente = reader["NombreCliente"].ToString(),
                    MarcaModeloVehiculo = reader["MarcaModeloVehiculo"].ToString()
                },
                CommandType.StoredProcedure,
                parametros
            );
        }

        public List<ReservaCLS> ListarReservasPorVehiculo(int vehiculoId)
        {
            SqlParameter[] parametros = new SqlParameter[]
            {
                new SqlParameter("@VehiculoId", vehiculoId)
            };

            return EjecutarListado<ReservaCLS>(
                "sp_ListarReservasPorVehiculo",
                reader => new ReservaCLS
                {
                    Id = Convert.ToInt32(reader["Id"]),
                    ClienteId = Convert.ToInt32(reader["ClienteId"]),
                    VehiculoId = Convert.ToInt32(reader["VehiculoId"]),
                    FechaInicio = Convert.ToDateTime(reader["FechaInicio"]),
                    FechaFin = Convert.ToDateTime(reader["FechaFin"]),
                    Estado = reader["Estado"].ToString(),
                    Habilitado = Convert.ToBoolean(reader["Habilitado"]),
                    Path = reader["Path"] == DBNull.Value ? null : reader["Path"].ToString(),
                    Descripcion = reader["Descripcion"] == DBNull.Value ? null : reader["Descripcion"].ToString(),
                    NombreCliente = reader["NombreCliente"].ToString(),
                    MarcaModeloVehiculo = reader["MarcaModeloVehiculo"].ToString()
                },
                CommandType.StoredProcedure,
                parametros
            );
        }
    }
}