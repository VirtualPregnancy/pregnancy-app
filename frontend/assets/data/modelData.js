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
                xDataPath: '/waveforms/normal/time.csv',
                yAxis: 'Signal',
                yDataPath: '/waveforms/normal/signal.csv',
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
                xDataPath: '/waveforms/fgr/time.csv',
                yAxis: 'Signal',
                yDataPath: '/waveforms/fgr/signal.csv',
                title: 'FGR',
                isPlaying: true,
                speed: 1,
                description: 'Fetal Growth Restriction, the blood flow is reduced compared to normal.',
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
                xDataPath: '/waveforms/gdm/time.csv',
                yAxis: 'Signal',
                yDataPath: '/waveforms/gdm/signal.csv',
                title: 'GDM',
                isPlaying: true,
                speed: 1,
                description: 'Gestational Diabetes Melitus, the blood flow is increased compared to normal.',
            },
        }
    ]
}