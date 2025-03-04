using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using CapaEntidad;

namespace CapaDatos
{
    public class ClienteDAL : BaseDAL
    {
        public List<ClienteCLS> ListarClientes()
        {
            return EjecutarListado<ClienteCLS>(
                "sp_ListarClientes",
                reader => new ClienteCLS
                {
                    Id = Convert.ToInt32(reader["Id"]),
                    Nombre = reader["Nombre"].ToString(),
                    Apellido = reader["Apellido"].ToString(),
                    Telefono = reader["Telefono"].ToString(),
                    Email = reader["Email"].ToString(),
                    Habilitado = Convert.ToBoolean(reader["Habilitado"]),
                    Path = reader["Path"] == DBNull.Value ? null : reader["Path"].ToString(),
                    Descripcion = reader["Descripcion"] == DBNull.Value ? null : reader["Descripcion"].ToString()
                },
                CommandType.StoredProcedure
            );
        }

        public List<ClienteCLS> FiltrarClientes(string nombre, string apellido, string email)
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

            if (!string.IsNullOrEmpty(email))
            {
                parametros.Add(new SqlParameter("@Email", email));
            }
            else
            {
                parametros.Add(new SqlParameter("@Email", DBNull.Value));
            }

            return EjecutarListado<ClienteCLS>(
                "sp_FiltrarClientes",
                reader => new ClienteCLS
                {
                    Id = Convert.ToInt32(reader["Id"]),
                    Nombre = reader["Nombre"].ToString(),
                    Apellido = reader["Apellido"].ToString(),
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

        public int GuardarDatosCliente(ClienteCLS objCliente)
        {
            List<SqlParameter> parametros = new List<SqlParameter>
            {
                new SqlParameter("@Nombre", objCliente.Nombre),
                new SqlParameter("@Apellido", objCliente.Apellido),
                new SqlParameter("@Telefono", objCliente.Telefono),
                new SqlParameter("@Email", objCliente.Email),
                new SqlParameter("@Path", objCliente.Path ?? (object)DBNull.Value),
                new SqlParameter("@Descripcion", objCliente.Descripcion ?? (object)DBNull.Value)
            };

            string procedimiento;

            if (objCliente.Id == 0)
            {
                // Insertar nuevo cliente
                procedimiento = "sp_InsertarCliente";
            }
            else
            {
                // Actualizar cliente existente
                procedimiento = "sp_ActualizarCliente";
                parametros.Add(new SqlParameter("@Id", objCliente.Id));
            }

            return EjecutarComandoSQL(procedimiento, CommandType.StoredProcedure, parametros.ToArray());
        }

        public int EliminarCliente(int id)
        {
            SqlParameter[] parametros = new SqlParameter[]
            {
                new SqlParameter("@Id", id)
            };

            return EjecutarComandoSQL("sp_EliminarCliente", CommandType.StoredProcedure, parametros);
        }

        public ClienteCLS ObtenerClientePorId(int id)
        {
            SqlParameter[] parametros = new SqlParameter[]
            {
                new SqlParameter("@Id", id)
            };

            List<ClienteCLS> clientes = EjecutarListado<ClienteCLS>(
                "sp_ObtenerClientePorId",
                reader => new ClienteCLS
                {
                    Id = Convert.ToInt32(reader["Id"]),
                    Nombre = reader["Nombre"].ToString(),
                    Apellido = reader["Apellido"].ToString(),
                    Telefono = reader["Telefono"].ToString(),
                    Email = reader["Email"].ToString(),
                    Habilitado = Convert.ToBoolean(reader["Habilitado"]),
                    Path = reader["Path"] == DBNull.Value ? null : reader["Path"].ToString(),
                    Descripcion = reader["Descripcion"] == DBNull.Value ? null : reader["Descripcion"].ToString()
                },
                CommandType.StoredProcedure,
                parametros
            );

            return clientes != null && clientes.Count > 0 ? clientes[0] : null;
        }
    }
}