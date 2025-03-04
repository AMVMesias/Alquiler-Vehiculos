using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using CapaEntidad;

namespace CapaDatos
{
    public class EmpleadoDAL : BaseDAL
    {
        public List<EmpleadoCLS> ListarEmpleados()
        {
            return EjecutarListado<EmpleadoCLS>(
                "sp_ListarEmpleados",
                reader => new EmpleadoCLS
                {
                    Id = Convert.ToInt32(reader["Id"]),
                    Nombre = reader["Nombre"].ToString(),
                    Apellido = reader["Apellido"].ToString(),
                    Cargo = reader["Cargo"].ToString(),
                    Telefono = reader["Telefono"].ToString(),
                    Email = reader["Email"].ToString(),
                    Habilitado = Convert.ToBoolean(reader["Habilitado"]),
                    Path = reader["Path"] == DBNull.Value ? null : reader["Path"].ToString(),
                    Descripcion = reader["Descripcion"] == DBNull.Value ? null : reader["Descripcion"].ToString()
                },
                CommandType.StoredProcedure
            );
        }

        public List<EmpleadoCLS> FiltrarEmpleados(string nombre, string apellido, string cargo, string email)
        {
            List<SqlParameter> parametros = new List<SqlParameter>();

            if (!string.IsNullOrEmpty(nombre))
            {
                parametros.Add(new SqlParameter("@Nombre", nombre));
            }
            else
            {
                parametros.Add(new SqlParameter("@Nombre", DBNull.Value));
            }

            if (!string.IsNullOrEmpty(apellido))
            {
                parametros.Add(new SqlParameter("@Apellido", apellido));
            }
            else
            {
                parametros.Add(new SqlParameter("@Apellido", DBNull.Value));
            }

            if (!string.IsNullOrEmpty(cargo))
            {
                parametros.Add(new SqlParameter("@Cargo", cargo));
            }
            else
            {
                parametros.Add(new SqlParameter("@Cargo", DBNull.Value));
            }

            if (!string.IsNullOrEmpty(email))
            {
                parametros.Add(new SqlParameter("@Email", email));
            }
            else
            {
                parametros.Add(new SqlParameter("@Email", DBNull.Value));
            }

            return EjecutarListado<EmpleadoCLS>(
                "sp_FiltrarEmpleados",
                reader => new EmpleadoCLS
                {
                    Id = Convert.ToInt32(reader["Id"]),
                    Nombre = reader["Nombre"].ToString(),
                    Apellido = reader["Apellido"].ToString(),
                    Cargo = reader["Cargo"].ToString(),
                    Telefono = reader["Telefono"].ToString(),
                    Email = reader["Email"].ToString(),
                    Habilitado = Convert.ToBoolean(reader["Habilitado"]),
                    Path = reader["Path"] == DBNull.Value ? null : reader["Path"].ToString(),
                    Descripcion = reader["Descripcion"] == DBNull.Value ? null : reader["Descripcion"].ToString()
                },
                CommandType.StoredProcedure,
                parametros.ToArray()
            );
        }

        public int GuardarDatosEmpleado(EmpleadoCLS objEmpleado)
        {
            List<SqlParameter> parametros = new List<SqlParameter>
            {
                new SqlParameter("@Nombre", objEmpleado.Nombre),
                new SqlParameter("@Apellido", objEmpleado.Apellido),
                new SqlParameter("@Cargo", objEmpleado.Cargo),
                new SqlParameter("@Telefono", objEmpleado.Telefono),
                new SqlParameter("@Email", objEmpleado.Email),
                new SqlParameter("@Path", objEmpleado.Path ?? (object)DBNull.Value),
                new SqlParameter("@Descripcion", objEmpleado.Descripcion ?? (object)DBNull.Value)
            };

            string procedimiento;

            if (objEmpleado.Id == 0)
            {
                // Insertar nuevo empleado
                procedimiento = "sp_InsertarEmpleado";
            }
            else
            {
                // Actualizar empleado existente
                procedimiento = "sp_ActualizarEmpleado";
                parametros.Add(new SqlParameter("@Id", objEmpleado.Id));
            }

            return EjecutarComandoSQL(procedimiento, CommandType.StoredProcedure, parametros.ToArray());
        }

        public int EliminarEmpleado(int id)
        {
            SqlParameter[] parametros = new SqlParameter[]
            {
                new SqlParameter("@Id", id)
            };

            return EjecutarComandoSQL("sp_EliminarEmpleado", CommandType.StoredProcedure, parametros);
        }

        public EmpleadoCLS ObtenerEmpleadoPorId(int id)
        {
            SqlParameter[] parametros = new SqlParameter[]
            {
                new SqlParameter("@Id", id)
            };

            List<EmpleadoCLS> empleados = EjecutarListado<EmpleadoCLS>(
                "sp_ObtenerEmpleadoPorId",
                reader => new EmpleadoCLS
                {
                    Id = Convert.ToInt32(reader["Id"]),
                    Nombre = reader["Nombre"].ToString(),
                    Apellido = reader["Apellido"].ToString(),
                    Cargo = reader["Cargo"].ToString(),
                    Telefono = reader["Telefono"].ToString(),
                    Email = reader["Email"].ToString(),
                    Habilitado = Convert.ToBoolean(reader["Habilitado"]),
                    Path = reader["Path"] == DBNull.Value ? null : reader["Path"].ToString(),
                    Descripcion = reader["Descripcion"] == DBNull.Value ? null : reader["Descripcion"].ToString()
                },
                CommandType.StoredProcedure,
                parametros
            );

            return empleados != null && empleados.Count > 0 ? empleados[0] : null;
        }
    }
}