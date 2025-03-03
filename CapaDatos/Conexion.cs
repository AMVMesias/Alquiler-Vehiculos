using Microsoft.Extensions.Configuration;
using System.Data;
using System.Data.SqlClient;

namespace CapaDatos
{
    public class Conexion
    {
        public static string GetConnectionString()
        {
            IConfigurationBuilder builder = new ConfigurationBuilder();
            builder.AddJsonFile(Path.Combine(Directory.GetCurrentDirectory(), "appsettings.json"));
            var root = builder.Build();
            return root.GetConnectionString("cn");
        }

        public static SqlDataReader ExecuteReader(string commandText, CommandType commandType)
        {
            SqlConnection cn = new SqlConnection(GetConnectionString());
            SqlDataReader reader = null;

            try
            {
                cn.Open();
                using (SqlCommand cmd = new SqlCommand(commandText, cn))
                {
                    cmd.CommandType = commandType;
                    reader = cmd.ExecuteReader(CommandBehavior.CloseConnection);
                }
            }
            catch (Exception)
            {
                if (cn.State == ConnectionState.Open)
                {
                    cn.Close();
                }
                cn.Dispose();
                throw;
            }

            return reader;
        }
    }
}