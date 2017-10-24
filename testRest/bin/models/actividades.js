/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('actividades', {
    keym: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true
    },
    id_actividad: {
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
    keym_car: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: {
        model: 'caracteristicas',
        key: 'keym'
      }
    },
    id_usuario_car: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true
    },
    id_caracteristica: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true
    },
    nombre: {
      type: DataTypes.STRING,
      allowNull: false
    },
    descripcion: {
      type: DataTypes.STRING,
      allowNull: false
    },
    pos: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    folder: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    fecha_ultima_modificacion: {
      type: DataTypes.STRING,
      allowNull: true
    }
  }, {
    tableName: 'actividades'
  });
};
