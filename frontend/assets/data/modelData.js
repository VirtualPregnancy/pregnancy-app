export default {
    models: [
        {
            // the first model is the default model
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
            },
            waveform: {
                xAxis: 'Time (s)',
                xDataPath: '/model/normal/time.csv',
                yAxis: 'Signal',
                yDataPath: '/model/normal/signal.csv',
                title: 'Normal Placenta',
                isPlaying: true,
                speed: 1,
                description: 'Blood flow characteristics in the umbilical cord can reflect the health of the fetus',
            },
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
            },
            waveform: {
                xAxis: 'Time (s)',
                xDataPath: '/model/fgr/time.csv',
                yAxis: 'Signal',
                yDataPath: '/model/fgr/signal.csv',
                title: 'Fetal Growth Restriction',
                isPlaying: true,
                speed: 1,
                description: 'Fetal Growth Restriction',
            },
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
            },
            waveform: {
                xAxis: 'Time (s)',
                xDataPath: '/model/gdm/time.csv',
                yAxis: 'Signal',
                yDataPath: '/model/gdm/signal.csv',
                title: 'Gestational Diabetes Melitus',
                isPlaying: true,
                speed: 1,
                description: 'Gestational Diabetes Melitus',
            },
        }
    ]
}