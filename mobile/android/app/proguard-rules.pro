# R8 shrinks and optimises the release build. Capacitor ships its own keep rules for plugins
# (@CapacitorPlugin classes and their @PluginMethod methods are found by reflection), and the
# AndroidX and Play libraries ship theirs, so nothing else needs keeping here.

# Stack traces from Play's vitals stay readable with the mapping file Play keeps per release.
-keepattributes SourceFile,LineNumberTable
-renamesourcefileattribute SourceFile
