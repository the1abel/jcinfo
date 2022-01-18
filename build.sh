echo "**********************************************************************"
echo "$(TZ=America/Los_Angeles date) - Git pull commencing..."
echo "**********************************************************************"
git pull

echo "**********************************************************************"
echo "$(TZ=America/Los_Angeles date) - Build front end commencing..."
echo "**********************************************************************"

cd jcinfo-frontend
npm run build

echo "**********************************************************************"
echo "$(TZ=America/Los_Angeles date) - Build back end commencing..."
echo "**********************************************************************"

cd ../JCInfo-Backend
./build.sh

echo "**********************************************************************"
echo "$(TZ=America/Los_Angeles date) - Build finished."
echo "**********************************************************************"
