echo ""
echo "**********************************************************************"
echo "$(TZ=America/Los_Angeles date) - Git pull commencing..."
echo "**********************************************************************"
git pull

echo ""
echo "**********************************************************************"
echo "$(TZ=America/Los_Angeles date) - Build front end commencing..."
echo "**********************************************************************"

cd frontend
npm i
npm run build

echo ""
echo "**********************************************************************"
echo "$(TZ=America/Los_Angeles date) - Build back end commencing..."
echo "**********************************************************************"

cd ../backend
./build.sh

echo ""
echo "**********************************************************************"
echo "$(TZ=America/Los_Angeles date) - Build finished."
echo "**********************************************************************"
echo ""
