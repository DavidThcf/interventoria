/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('archivos', {
    keym_arc: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true
    },
    id_archivo: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true
    },
    id_usuario_arc: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true
    },
    keym_car: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: {
        model: 'caracteristicas',
        key: 'keym'
      }
    },
    id_caracteristica: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true
    },
    id_usuario_car: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true
    },
    nombre_archivo: {
      type: DataTypes.STRING,
      allowNull: false
    },
    titulo: {
      type: DataTypes.STRING,
      allowNull: true
    },
    subtitulo: {
      type: DataTypes.STRING,
      allowNull: true
    },
    descripcion: {
      type: DataTypes.STRING,
      allowNull: true
    },
    contenido: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    fecha_creacion: {
      type: DataTypes.STRING,
      allowNull: false
    },
    fecha_ultima_modificacion: {
      type: DataTypes.STRING,
      allowNull: false
    },
    publicacion: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    tipo: {
      type: DataTypes.STRING,
      allowNull: true
    },
    localizacion: {
      type: DataTypes.DOUBLE,
      allowNull: true
    },
    longitud: {
      type: DataTypes.DOUBLE,
      allowNull: true
    },
    srcGifServ: {
      type: DataTypes.STRING,
      allowNull: true
    },
    srcServ: {
      type: DataTypes.STRING,
      allowNull: true
    }
  }, {
    tableName: 'archivos'
  });
};
