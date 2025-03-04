using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using CapaEntidad;

namespace CapaDatos
{
    public class VehiculoDAL : BaseDAL
    {
        public List<VehiculoCLS> ListarVehiculos()
        {
            return EjecutarListado<VehiculoCLS>(
                "sp_ListarVehiculos",
                reader => new VehiculoCLS
                {
                    Id = Convert.ToInt32(reader["Id"]),
                    Marca = reader["Marca"].ToString(),
                    Modelo = reader["Modelo"].ToString(),
                    Año = Convert.ToInt32(reader["Año"]),
                    Precio = Convert.ToDecimal(reader["Precio"]),
                    Estado = reader["Estado"].ToString(),
                    Habilitado = Convert.ToBoolean(reader["Habilitado"]),
                    Path = reader["Path"] == DBNull.Value ? null : reader["Path"].ToString(),
                    Descripcion = reader["Descripcion"] == DBNull.Value ? null : reader["Descripcion"].ToString()
                },
                CommandType.StoredProcedure  // Cambiado a tipo procedimiento almacenado
            );
        }

        public List<VehiculoCLS> FiltrarVehiculos(string marca, string modelo)
        {
            List<SqlParameter> parametros = new List<SqlParameter>();

            // Solo agregar parámetros si tienen valor
            if (!string.IsNullOrEmpty(marca))
            {
                parametros.Add(new SqlParameter("@Marca", marca));
            }
            else
            {
                parametros.Add(new SqlParameter("@Marca", DBNull.Value));
            }

            if (!string.IsNullOrEmpty(modelo))
            {
                parametros.Add(new SqlParameter("@Modelo", modelo));
            }
            else
            {
                parametros.Add(new SqlParameter("@Modelo", DBNull.Value));
            }

            return EjecutarListado<VehiculoCLS>(
                "sp_FiltrarVehiculos",
                reader => new VehiculoCLS
                {
                    Id = Convert.ToInt32(reader["Id"]),
                    Marca = reader["Marca"].ToString(),
                    Modelo = reader["Modelo"].ToString(),
                    Año = Convert.ToInt32(reader["Año"]),
                    Precio = Convert.ToDecimal(reader["Precio"]),
                    Estado = reader["Estado"].ToString(),
                    Habilitado = Convert.ToBoolean(reader["Habilitado"]),
                    Path = reader["Path"] == DBNull.Value ? null : reader["Path"].ToString(),
                    Descripcion = reader["Descripcion"] == DBNull.Value ? null : reader["Descripcion"].ToString()
                },
                CommandType.StoredProcedure,
                parametros.ToArray()
            );
        }

        public int GuardarDatosVehiculo(VehiculoCLS objVehiculo)
        {
            List<SqlParameter> parametros = new List<SqlParameter>
            {
                new SqlParameter("@Marca", objVehiculo.Marca),
                new SqlParameter("@Modelo", objVehiculo.Modelo),
                new SqlParameter("@Año", objVehiculo.Año),
                new SqlParameter("@Precio", objVehiculo.Precio),
                new SqlParameter("@Estado", objVehiculo.Estado),
                new SqlParameter("@Path", objVehiculo.Path ?? (object)DBNull.Value),
                new SqlParameter("@Descripcion", objVehiculo.Descripcion ?? (object)DBNull.Value)
            };

            string procedimiento;

            if (objVehiculo.Id == 0)
            {
                // Insertar nuevo vehículo usando el procedimiento almacenado
                procedimiento = "sp_InsertarVehiculo";
            }
            else
            {
                // Actualizar vehículo existente usando el procedimiento almacenado
                procedimiento = "sp_ActualizarVehiculo";
                parametros.Add(new SqlParameter("@Id", objVehiculo.Id));
            }

            return EjecutarComandoSQL(procedimiento, CommandType.StoredProcedure, parametros.ToArray());
        }

        public int EliminarVehiculo(int id)
        {
            SqlParameter[] parametros = new SqlParameter[]
            {
                new SqlParameter("@Id", id)
            };

            return EjecutarComandoSQL("sp_EliminarVehiculo", CommandType.StoredProcedure, parametros);
        }

        public VehiculoCLS ObtenerVehiculoPorId(int id)
        {
            SqlParameter[] parametros = new SqlParameter[]
            {
                new SqlParameter("@Id", id)
            };

            List<VehiculoCLS> vehiculos = EjecutarListado<VehiculoCLS>(
                "SELECT Id, Marca, Modelo, Año, Precio, Estado, Habilitado, Path, Descripcion " +
                "FROM Vehiculos WHERE Id = @Id AND Habilitado = 1",
                reader => new VehiculoCLS
                {
                    Id = Convert.ToInt32(reader["Id"]),
                    Marca = reader["Marca"].ToString(),
                    Modelo = reader["Modelo"].ToString(),
                    Año = Convert.ToInt32(reader["Año"]),
                    Precio = Convert.ToDecimal(reader["Precio"]),
                    Estado = reader["Estado"].ToString(),
                    Habilitado = Convert.ToBoolean(reader["Habilitado"]),
                    Path = reader["Path"] == DBNull.Value ? null : reader["Path"].ToString(),
                    Descripcion = reader["Descripcion"] == DBNull.Value ? null : reader["Descripcion"].ToString()
                },
                CommandType.Text,
                parametros
            );

            // Devuelve el primer vehículo o null si no se encontró
            return vehiculos != null && vehiculos.Count > 0 ? vehiculos[0] : null;
        }
    }
}