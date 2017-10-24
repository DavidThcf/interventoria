/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('table_sequence', {
    actividades: {
      type: DataTypes.BIGINT,
      allowNull: false,
      defaultValue: '0'
    },
    archivos: {
      type: DataTypes.BIGINT,
      allowNull: false,
      defaultValue: '0'
    },
    caracteristicas: {
      type: DataTypes.BIGINT,
      allowNull: false,
      defaultValue: '0'
    },
    costos: {
      type: DataTypes.BIGINT,
      allowNull: false,
      defaultValue: '0'
    },
    proyectos: {
      type: DataTypes.BIGINT,
      allowNull: false,
      defaultValue: '0'
    },
    proyectos_meta_datos: {
      type: DataTypes.BIGINT,
      allowNull: false,
      defaultValue: '0'
    },
    recursos: {
      type: DataTypes.BIGINT,
      allowNull: false,
      defaultValue: '0'
    },
    presuspuesto: {
      type: DataTypes.BIGINT,
      allowNull: false,
      defaultValue: '0'
    },
    key: {
      type: DataTypes.BIGINT,
      allowNull: false,
      defaultValue: '0',
      primaryKey: true
    }
  }, {
    tableName: 'table_sequence'
  });
};
