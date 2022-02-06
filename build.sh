# execute via: /opt/jcinfo/build.sh | tee -a '/opt/jcinfo/build.log'
# -a means append


echo ""
echo "**********************************************************************"
echo "$(TZ=America/Los_Angeles date) - Git pull commencing..."
echo "**********************************************************************"
cd /opt/jcinfo
git pull

echo ""
echo "**********************************************************************"
echo "$(TZ=America/Los_Angeles date) - Build front end commencing..."
echo "**********************************************************************"

cd frontend
echo "*** npm i"
npm i
echo "*** npm run build"
npm run build

echo ""
echo "**********************************************************************"
echo "$(TZ=America/Los_Angeles date) - Build back end commencing..."
echo "**********************************************************************"

cd ../backend
echo "*** ./build/sh"
./build.sh

echo ""
echo "**********************************************************************"
echo "$(TZ=America/Los_Angeles date) - Build finished."
echo "**********************************************************************"
echo ""
