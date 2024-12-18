import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score, classification_report
from sklearn.preprocessing import StandardScaler
from sklearn.impute import SimpleImputer

def preprocess_data(X, y):
    # Handle missing values
    imputer = SimpleImputer(strategy='mean')
    X = imputer.fit_transform(X)

    # Normalize features
    scaler = StandardScaler()
    X = scaler.fit_transform(X)

    return X, y

def train_fault_prediction_model(X, y):
    # Preprocess the data
    X, y = preprocess_data(X, y)

    # Split the data
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

    # Train a Random Forest Classifier
    clf = RandomForestClassifier(n_estimators=100, random_state=42)
    clf.fit(X_train, y_train)

    # Make predictions
    y_pred = clf.predict(X_test)

    # Print the results
    print("Accuracy:", accuracy_score(y_test, y_pred))
    print("\nClassification Report:")
    print(classification_report(y_test, y_pred))

    return clf

# Example usage
if __name__ == "__main__":
    # Generate some dummy data
    np.random.seed(42)
    X = np.random.rand(1000, 10)  # 10 features
    y = np.random.randint(2, size=1000)  # Binary classification: fault or no fault

    model = train_fault_prediction_model(X, y)

