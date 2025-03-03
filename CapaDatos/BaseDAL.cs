using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;

namespace CapaDatos
{
    public abstract class BaseDAL
    {
        protected List<T> EjecutarListado<T>(string comandoTexto, Func<SqlDataReader, T> mapeo, CommandType tipoComando = CommandType.StoredProcedure, SqlParameter[] parametros = null)
        {
            List<T> lista = new List<T>();
            SqlDataReader reader = null;

            try
            {
                reader = EjecutarReader(comandoTexto, tipoComando, parametros);

                if (reader != null)
                {
                    while (reader.Read())
                    {
                        lista.Add(mapeo(reader));
                    }
                }
            }
            catch (Exception)
            {
                lista = null;
            }
            finally
            {
                if (reader != null && !reader.IsClosed)
                {
                    reader.Close();
                }
            }

            return lista;
        }

        protected int EjecutarComandoSQL(string comandoTexto, CommandType tipoComando = CommandType.Text, SqlParameter[] parametros = null)
        {
            int filasAfectadas = 0;
            SqlConnection conn = null;

            try
            {
                conn = new SqlConnection(Conexion.GetConnectionString());
                using (SqlCommand cmd = new SqlCommand(comandoTexto, conn))
                {
                    cmd.CommandType = tipoComando;
                    if (parametros != null)
                    {
                        cmd.Parameters.AddRange(parametros);
                    }
                    conn.Open();
                    filasAfectadas = cmd.ExecuteNonQuery();
                }
            }
            catch (Exception)
            {
                filasAfectadas = 0;
            }
            finally
            {
                if (conn != null && conn.State == ConnectionState.Open)
                {
                    conn.Close();
                    conn.Dispose();
                }
            }

            return filasAfectadas;
        }

        protected SqlDataReader EjecutarReader(string comandoTexto, CommandType tipoComando = CommandType.StoredProcedure, SqlParameter[] parametros = null)
        {
            SqlConnection conn = new SqlConnection(Conexion.GetConnectionString());
            SqlDataReader reader = null;

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
                    reader = cmd.ExecuteReader(CommandBehavior.CloseConnection);
                }
            }
            catch (Exception)
            {
                if (conn.State == ConnectionState.Open)
                {
                    conn.Close();
                }
                conn.Dispose();
                throw;
            }

            return reader;
        }
    }
}