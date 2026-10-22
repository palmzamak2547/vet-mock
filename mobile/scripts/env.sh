# Toolchain for building the Android app on this machine. Source it: `. mobile/scripts/env.sh`.
# JDK 21 (Capacitor 8 needs it) and the Android SDK whose licence the owner accepted on 2026-10-10.
# Override any of these in the environment to use other copies.
export JAVA_HOME="${JAVA_HOME:-C:/dev/_tools/rea/jdk-21.0.12.1+1}"
export ANDROID_HOME="${ANDROID_HOME:-C:/dev/philosophew-android/.tools/android-sdk}"
export ANDROID_SDK_ROOT="$ANDROID_HOME"
export GRADLE_USER_HOME="${GRADLE_USER_HOME:-C:/dev/_tools/gradle-home}"
export PATH="$JAVA_HOME/bin:$PATH"
