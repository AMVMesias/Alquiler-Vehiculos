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
            // Solo listar vehículos habilitados
            return EjecutarListado<VehiculoCLS>(
                "SELECT Id, Marca, Modelo, Año, Precio, Estado, Habilitado FROM Vehiculos WHERE Habilitado = 1",
                reader => new VehiculoCLS
                {
                    Id = Convert.ToInt32(reader["Id"]),
                    Marca = reader["Marca"].ToString(),
                    Modelo = reader["Modelo"].ToString(),
                    Año = Convert.ToInt32(reader["Año"]),
                    Precio = Convert.ToDecimal(reader["Precio"]),
                    Estado = reader["Estado"].ToString(),
                    Habilitado = Convert.ToBoolean(reader["Habilitado"])
                },
                CommandType.Text
            );
        }

        public List<VehiculoCLS> FiltrarVehiculos(string marca, string modelo)
        {
            string consulta = @"
                SELECT Id, Marca, Modelo, Año, Precio, Estado, Habilitado 
                FROM Vehiculos 
                WHERE Habilitado = 1 ";

            List<SqlParameter> parametros = new List<SqlParameter>();

            if (!string.IsNullOrEmpty(marca))
            {
                consulta += " AND Marca LIKE @Marca ";
                parametros.Add(new SqlParameter("@Marca", "%" + marca + "%"));
            }

            if (!string.IsNullOrEmpty(modelo))
            {
                consulta += " AND Modelo LIKE @Modelo ";
                parametros.Add(new SqlParameter("@Modelo", "%" + modelo + "%"));
            }

            return EjecutarListado<VehiculoCLS>(
                consulta,
                reader => new VehiculoCLS
                {
                    Id = Convert.ToInt32(reader["Id"]),
                    Marca = reader["Marca"].ToString(),
                    Modelo = reader["Modelo"].ToString(),
                    Año = Convert.ToInt32(reader["Año"]),
                    Precio = Convert.ToDecimal(reader["Precio"]),
                    Estado = reader["Estado"].ToString(),
                    Habilitado = Convert.ToBoolean(reader["Habilitado"])
                },
                CommandType.Text,
                parametros.Count > 0 ? parametros.ToArray() : null
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
                new SqlParameter("@Estado", objVehiculo.Estado)
            };

            string consulta;

            if (objVehiculo.Id == 0)
            {
                // Insertar nuevo vehículo (siempre habilitado por defecto)
                consulta = @"
                    INSERT INTO Vehiculos (Marca, Modelo, Año, Precio, Estado, Habilitado)
                    VALUES (@Marca, @Modelo, @Año, @Precio, @Estado, 1)";
            }
            else
            {
                // Actualizar vehículo existente
                consulta = @"
                    UPDATE Vehiculos
                    SET Marca = @Marca,
                        Modelo = @Modelo,
                        Año = @Año,
                        Precio = @Precio,
                        Estado = @Estado
                    WHERE Id = @Id AND Habilitado = 1";
                parametros.Add(new SqlParameter("@Id", objVehiculo.Id));
            }

            return EjecutarComandoSQL(consulta, CommandType.Text, parametros.ToArray());
        }

        public int EliminarVehiculo(int id)
        {
            // Eliminación lógica (cambiar Habilitado a 0)
            string consulta = "UPDATE Vehiculos SET Habilitado = 0 WHERE Id = @Id";
            SqlParameter[] parametros = new SqlParameter[]
            {
                new SqlParameter("@Id", id)
            };

            return EjecutarComandoSQL(consulta, CommandType.Text, parametros);
        }
    }
}