<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

require '../../../vendor/autoload.php';

use Google\Client;
use Google\Service\AnalyticsData;

// Path to the service account key file
$serviceAccountPath = './google_apis_pecut.json';

// Property ID for GA4
$propertyId = '455762303';

// Initialize the Google Client
$client = new Client();
$client->setAuthConfig($serviceAccountPath);
$client->addScope('https://www.googleapis.com/auth/analytics.readonly');

function getData($analyticsData, $propertyId, $dimension, $typeReport)
{
    if($typeReport == 'RealtimeReport'){
        // Realtime Report
        $ReqBodyRealtime = new AnalyticsData\RunRealtimeReportRequest([
            'dimensions' => [
                ['name' => $dimension],       // Active pages or country
            ],
            'metrics' => [
                ['name' => 'activeUsers'],     // Active users metric
            ],
        ]);
        // Fetch the real-time report
        $response = $analyticsData->properties->runRealtimeReport(
            "properties/$propertyId",
            $ReqBodyRealtime
        );
        // echo json_encode($response);
        foreach ($response->getRows() as $row) {
            $dimensions = $row->getDimensionValues();
            $metrics = $row->getMetricValues();
            $data[] = [
                $dimension => $dimensions[0]->getValue(),
                'active_users' => $metrics[0]->getValue()
            ];
        }
        return $data;
    }elseif($typeReport == 'BasicReport'){
        // Basic Report
        $ReqBodyRealtime = new AnalyticsData\RunReportRequest([
            'dateRanges' => [
                ['startDate' => '2024-01-01', 'endDate' => 'today'],
            ],
            'dimensions' => [
                ['name' => $dimension],       // Active pages or country
            ],
            'metrics' => [
                ['name' => 'totalUsers'],     // Total users metric
                ['name' => 'newUsers'],     // New users metric
            ],
        ]);
        // Fetch the real-time report
        $response = $analyticsData->properties->runReport(
            "properties/$propertyId",
            $ReqBodyRealtime
        );
        // echo json_encode($response);
        foreach ($response->getRows() as $row) {
            $dimensions = $row->getDimensionValues();
            $metrics = $row->getMetricValues();
            $data[] = [
                $dimension => $dimensions[0]->getValue(),
                'totalUsers' => $metrics[0]->getValue(),
                'newUsers' => $metrics[1]->getValue()
            ];
        }
        return $data;
    }
}


// Initialize the Analytics Data service
$analyticsData = new AnalyticsData($client);

$response['totalUsers'] = getData($analyticsData, $propertyId, 'date', 'BasicReport');
$response['liveUsers'] = getData($analyticsData, $propertyId, 'deviceCategory', 'RealtimeReport');
// $response['liveUsers'] = getData($analyticsData, $propertyId, 'unifiedScreenName', 'RealtimeReport');
// $response['country'] = getData($analyticsData, $propertyId, 'country', 'RealtimeReport');
echo json_encode($response);

exit;
