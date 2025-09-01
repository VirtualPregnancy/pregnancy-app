export default {
    models: [
        {
            model: 'healthy',
            modelName: 'Healthy Placenta',
            Description: 'Healthy Placenta',
            color: 'success',
            config: {
                path: '/model/healthy.vtk',
                displayName: 'Healthy Placenta',
                color: 0xff2222,
                opacity: 1.0,
                modelSize: 420,
                useCylinderGeometry: true,
                cylinderSegments: 10
            }
        }, {    
            model: 'fgr',
            path: '/model/fgr.vtk',
            modelName: 'Fetal Growth Restriction',
            Description: 'Fetal Growth Restriction',
            color: 'success',
            config: {
                path: '/model/fgr.vtk',
                displayName: 'Fetal Growth Restriction',
                color: 0xff2222,
                opacity: 1.0,
                modelSize: 420,
                useCylinderGeometry: true,
                cylinderSegments: 10,
                defaultRotationY: -Math.PI/2 // Default horizontal rotation angle in radians
          // Examples:
          // defaultRotationY: 0,        // No rotation
          // defaultRotationY: Math.PI/4, // 45 degrees clockwise
          // defaultRotationY: Math.PI/2, // 90 degrees clockwise
          // defaultRotationY: Math.PI,   // 180 degrees
          // defaultRotationY: -Math.PI/4, // 45 degrees counter-clockwise
            }
        }, {
            model: 'normal',
            path: '/model/normal.vtk',
            modelName: 'Normal',
            Description: 'Healthy',
            color: 'error',
            config: {
                path: '/model/normal.vtk',
                displayName: 'Normal',
                color: 0xff2222,
                opacity: 1.0,
                modelSize: 420,
                useCylinderGeometry: true,
                cylinderSegments: 10,
            }
        }
    ]
}