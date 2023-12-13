import { Routes } from '@angular/router';
import { ModelFormComponent } from './components/model-form/model-form.component';
import { HomePageComponent } from './components/home-page/home-page.component';
import { FileUploadComponent } from './components/file-upload/file-upload.component';
import { TrainingResultsDisplayComponent } from './components/training-results-display/training-results-display.component';
import { MyModelsComponent } from './components/my-models/my-models.component';
import { ModelPredictComponent } from './components/model-predict/model-predict.component';
import { PredictionResultsDisplayComponent } from './prediction-results-display/prediction-results-display.component';

export const routes: Routes = [
    { path: '', pathMatch: 'full', redirectTo: 'home' },
    { path: 'home', component: HomePageComponent },
    { path: 'model-form', component: ModelFormComponent },
    { path: 'file-upload', component: FileUploadComponent},
    { path: 'file-upload/:modelName', component: FileUploadComponent},
    { path: 'training-results/:modelName', component: TrainingResultsDisplayComponent},
    { path: 'prediction-results/:modelName', component: PredictionResultsDisplayComponent},
    { path: 'my-models', component: MyModelsComponent},
    { path: 'predict/:modelName', component: ModelPredictComponent}
];
