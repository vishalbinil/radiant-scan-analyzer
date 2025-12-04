import numpy as np
from sklearn.neural_network import MLPClassifier
from sklearn.neural_network._rbm import BernoulliRBM
from sklearn.pipeline import Pipeline
from sklearn.model_selection import train_test_split
from sklearn import metrics
from tensorflow.keras.preprocessing.image import ImageDataGenerator
import joblib

datagen = ImageDataGenerator(rescale=1./255)

train_generator = datagen.flow_from_directory(
    'data/train',
    target_size=(128, 128),
    batch_size=500,
    class_mode='sparse',
    shuffle=True
)

X, y = next(train_generator)

X = X.reshape((X.shape[0], -1))  
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2)


rbm = BernoulliRBM(n_components=256, learning_rate=0.06, n_iter=10, verbose=1, random_state=42)
mlp = MLPClassifier(hidden_layer_sizes=(128,), max_iter=100, alpha=1e-4, solver='adam', verbose=True, random_state=42)


dbn_pipeline = Pipeline(steps=[('rbm', rbm), ('mlp', mlp)])


print("Training DBN...")
dbn_pipeline.fit(X_train, y_train)


y_pred = dbn_pipeline.predict(X_test)
accuracy = metrics.accuracy_score(y_test, y_pred)
print(f"DBN Accuracy: {accuracy * 100:.2f}%")


joblib.dump(dbn_pipeline, 'dbn_pipeline_model.pkl')
print("DBN model saved as dbn_pipeline_model.pkl")
 
