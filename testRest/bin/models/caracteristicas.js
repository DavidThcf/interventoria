/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('caracteristicas', {
    keym: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true
    },
    id_usuario: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: {
        model: 'usuarios',
        key: 'id_usuario'
      }
    },
    id_caracteristica: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true
    },
    keym_padre: {
      type: DataTypes.BIGINT,
      allowNull: true,
      references: {
        model: 'caracteristicas',
        key: 'keym'
      }
    },
    id_usuario_padre: {
      type: DataTypes.BIGINT,
      allowNull: true,
      primaryKey: true
    },
    id_caracteristica_padre: {
      type: DataTypes.BIGINT,
      allowNull: true,
      primaryKey: true
    },
    estado: {
      type: DataTypes.STRING,
      allowNull: false
    },
    porcentaje_asignado: {
      type: DataTypes.DOUBLE,
      allowNull: false,
      defaultValue: '0'
    },
    porcentaje_cumplido: {
      type: DataTypes.DOUBLE,
      allowNull: false,
      defaultValue: '0'
    },
    recursos: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    recursos_restantes: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    presupuesto: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    costos: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    tipo_caracteristica: {
      type: DataTypes.CHAR,
      allowNull: false
    },
    visualizar_superior: {
      type: DataTypes.BOOLEAN,
      allowNull: false
    },
    usuario_asignado: {
      type: DataTypes.BIGINT,
      allowNull: true,
      references: {
        model: 'usuarios',
        key: 'id_usuario'
      }
    },
    publicacion_web: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false
    },
    porcentaje: {
      type: DataTypes.DOUBLE,
      allowNull: true
    },
    fecha_inicio: {
      type: DataTypes.STRING,
      allowNull: true
    },
    fecha_fin: {
      type: DataTypes.STRING,
      allowNull: true
    },
    fecha_ultima_modificacion: {
      type: DataTypes.STRING,
      allowNull: true
    },
    publicacion_reporte: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    }
  }, {
    tableName: 'caracteristicas'
  });
};
