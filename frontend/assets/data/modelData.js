export default {
    models: [
        {
            model: 'normal',
            modelName: 'Normal',
            Description: 'Normal Placenta',
            color: 'error',
            config: {
                path: '/model/normal.vtk',
                displayName: 'Normal Placenta',
                color: 0xff2222,
                opacity: 1.0,
                modelSize: 420,
                useCylinderGeometry: true,
                cylinderSegments: 10,
            }
        },
        {    
            model: 'FGR',
            modelName: 'Fetal Growth Restriction (FGR) ',
            Description: 'Fetal Growth Restriction',
            color: 'info',
            config: {
                path: '/model/fgr.vtk',
                displayName: 'Fetal Growth Restriction',
                color: 0xff2222,
                opacity: 1,
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
        }, 
        {
            model: 'GDM',
            modelName: 'Gestational Diabetes Melitus (GDM)',
            Description: 'Gestational Diabetes Melitus',
            color: 'error',
            config: {
                path: '/model/diabetes.vtk',
                displayName: 'Gestational Diabetes Melitus',
                color: 0xff2222,
                opacity: 1.0,
                modelSize: 420,
                useCylinderGeometry: true,
                cylinderSegments: 10,
                defaultRotationY: Math.PI/2 
            }
        }
    ]
}