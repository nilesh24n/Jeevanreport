#!/usr/bin/env python3
import os
import json
import requests
import zipfile
import shutil
from pathlib import Path

# Configuration
SITE_ID = "cheery-macaron-afeefa"  # The Netlify site name
NETLIFY_TOKEN = "nfp_bYeMMVjGGEkoBXwQR2BCRGHTbDVphuQL3592"
BUILD_DIR = ".next"
ZIP_FILE = "deploy.zip"

# Create zip of .next directory
def create_zip():
    print("Creating zip file...")
    if os.path.exists(ZIP_FILE):
        os.remove(ZIP_FILE)
    
    shutil.make_archive(ZIP_FILE.replace('.zip', ''), 'zip', BUILD_DIR)
    print(f"Zip created: {ZIP_FILE}")

# Deploy to Netlify
def deploy():
    print(f"Deploying to Netlify site: {SITE_ID}...")
    
    headers = {
        "Authorization": f"Bearer {NETLIFY_TOKEN}",
        "Content-Type": "application/zip"
    }
    
    with open(ZIP_FILE, 'rb') as f:
        files = {"file": f}
        
        # Get the deploy URL
        deploy_url = f"https://api.netlify.com/api/v1/sites/{SITE_ID}/deploys"
        
        print(f"Upload URL: {deploy_url}")
        
        # Upload
        response = requests.post(
            deploy_url,
            headers=headers,
            data=f.read()
        )
        
        print(f"Status: {response.status_code}")
        print(f"Response: {response.text}")
        
        if response.status_code in [200, 201]:
            print("\n✅ Deployment successful!")
            data = response.json()
            print(f"Deploy ID: {data.get('id')}")
            print(f"URL: {data.get('deploy_url')}")
        else:
            print("\n❌ Deployment failed!")

if __name__ == "__main__":
    os.chdir("C:\\Jeevanreport2.0")
    create_zip()
    deploy()
