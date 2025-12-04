import os
import numpy as np
from tensorflow.keras.layers import Input, Dense, Dropout
from tensorflow.keras.models import Model
from tensorflow.keras.preprocessing.image import ImageDataGenerator
from tensorflow.keras.optimizers import Adam


IMAGE_SIZE = (128, 128)
BATCH_SIZE = 32
EPOCHS = 50
NUM_CLASSES = 4   

train_dir = 'data/train'
valid_dir = 'data/valid'


train_datagen = ImageDataGenerator(rescale=1./255)
valid_datagen = ImageDataGenerator(rescale=1./255)

train_generator = train_datagen.flow_from_directory(
    train_dir,
    target_size=IMAGE_SIZE,
    batch_size=BATCH_SIZE,
    class_mode='categorical',  
    shuffle=True
)

valid_generator = valid_datagen.flow_from_directory(
    valid_dir,
    target_size=IMAGE_SIZE,
    batch_size=BATCH_SIZE,
    class_mode='categorical',
    shuffle=False
)


input_shape = IMAGE_SIZE[0] * IMAGE_SIZE[1] * 3
input_img = Input(shape=(input_shape,))


encoded = Dense(512, activation='relu')(input_img)
encoded = Dropout(0.2)(encoded)
encoded = Dense(256, activation='relu')(encoded)
encoded = Dropout(0.2)(encoded)
encoded = Dense(128, activation='relu')(encoded)

output = Dense(NUM_CLASSES, activation='softmax')(encoded)


sdae_classifier = Model(inputs=input_img, outputs=output)
sdae_classifier.compile(
    optimizer=Adam(learning_rate=0.001),
    loss='categorical_crossentropy',
    metrics=['accuracy']
)

print(sdae_classifier.summary())


def generator_flattened(gen):
    for batch_x, batch_y in gen:
        batch_x_flat = batch_x.reshape(batch_x.shape[0], -1)  
        yield batch_x_flat, batch_y


sdae_classifier.fit(
    generator_flattened(train_generator),
    validation_data=generator_flattened(valid_generator),
    steps_per_epoch=train_generator.samples // BATCH_SIZE,
    validation_steps=valid_generator.samples // BATCH_SIZE,
    epochs=EPOCHS
)


sdae_classifier.save('sdae_classifier.h5')
print("SDAE classifier training complete and saved as sdae_classifier.h5")
