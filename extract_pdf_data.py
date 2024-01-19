#import PyMuPDF
import fitz
import re
import json
import csv

def extract_pdf_data(pdf_path):
    doc = fitz.open(pdf_path)
    text = ""

    for page in doc:
        text += page.get_text()

    doc.close()
    return text

def parse_schedule_data(text):
    course_pattern = re.compile(r'Linux Administration \d+|Git/GitHub\d+|Python Programming \d+|Containers\d+|Kubernetes\d+|AWS \d+|CI/CD\d+|Monitoring\d+|CCSP\d+|Ansible\d+|Terraform\d+')
    date_pattern = re.compile(r'\d{1,2}\.\d{1,2}\.\d{2,4}')
    lecturer_pattern = re.compile(r'[^\d\s]+\s[^\d\s]+(?=\n)')

    courses = course_pattern.findall(text)
    dates = date_pattern.findall(text)
    lecturers = lecturer_pattern.findall(text)

    schedule = []
    for course, date, lecturer in zip(courses, dates, lecturers):
        schedule.append({'course': course, 'date': date, 'lecturer': lecturer})

    return schedule

def save_to_json(data, filename):
    with open(filename, 'w', encoding='utf-8') as file:
        json.dump(data, file, ensure_ascii=False, indent=4)

def save_to_csv(data, filename):
    with open(filename, 'w', newline='', encoding='utf-8') as file:
        writer = csv.DictWriter(file, fieldnames=['course', 'date', 'lecturer'])
        writer.writeheader()
        writer.writerows(data)

def main():
    pdf_path = ' DevSecOps15.pdf'
    pdf_text = extract_pdf_data(pdf_path)
    schedule_data = parse_schedule_data(pdf_text)

    # Save to JSON
    save_to_json(schedule_data, 'schedule.json')

    # Optionally, save to CSV
    # save_to_csv(schedule_data, 'schedule.csv')

if __name__ == '__main__':
    main()
