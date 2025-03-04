using CapaDatos;
using CapaEntidad;
using System;
using System.Collections.Generic;

namespace CapaNegocio
{
    public class ClienteBL
    {
        private ClienteDAL clienteDAL = new ClienteDAL();

        public List<ClienteCLS> ListarClientes()
        {
            return clienteDAL.ListarClientes();
        }

        public List<ClienteCLS> FiltrarClientes(string nombre, string apellido, string email)
        {
            return clienteDAL.FiltrarClientes(nombre, apellido, email);
        }

        public int GuardarDatosCliente(ClienteCLS objCliente)
        {
            return clienteDAL.GuardarDatosCliente(objCliente);
        }

        public int EliminarCliente(int id)
        {
            return clienteDAL.EliminarCliente(id);
        }

        public ClienteCLS ObtenerClientePorId(int id)
        {
            return clienteDAL.ObtenerClientePorId(id);
        }
    }
}