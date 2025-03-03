using CapaDatos;
using CapaEntidad;
using System;
using System.Collections.Generic;

namespace CapaNegocio
{
    public class VehiculoBL
    {
        private VehiculoDAL vehiculoDAL = new VehiculoDAL();

        public List<VehiculoCLS> ListarVehiculos()
        {
            return vehiculoDAL.ListarVehiculos();
        }

        public List<VehiculoCLS> FiltrarVehiculos(string marca, string modelo)
        {
            return vehiculoDAL.FiltrarVehiculos(marca, modelo);
        }

        public int GuardarDatosVehiculo(VehiculoCLS objVehiculo)
        {
            return vehiculoDAL.GuardarDatosVehiculo(objVehiculo);
        }

        public int EliminarVehiculo(int id)
        {
            return vehiculoDAL.EliminarVehiculo(id);
        }
    }
}