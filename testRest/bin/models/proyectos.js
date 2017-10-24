/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('proyectos', {
    keym: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true
    },
    id_proyecto: {
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
      allowNull: true
    },
    plantilla: {
      type: DataTypes.STRING,
      allowNull: false
    },
    ir_proyecto: {
      type: DataTypes.BOOLEAN,
      allowNull: false
    },
    icon: {
      type: DataTypes.STRING,
      allowNull: true
    },
    descripcion: {
      type: DataTypes.STRING,
      allowNull: false
    },
    contador: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    fecha_ultima_modificacion: {
      type: DataTypes.STRING,
      allowNull: true
    }
  }, {
    tableName: 'proyectos'
  });
};
