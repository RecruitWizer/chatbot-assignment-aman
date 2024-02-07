import pdfplumber
import spacy
import re

def extract_text_from_pdf(pdf_path):
    with pdfplumber.open(pdf_path) as pdf:
        text = ""
        for page in pdf.pages:
            text += page.extract_text()
    return text

def is_phone_number(token_text):
    # Regular expression to match phone number patterns
    phone_pattern = re.compile(r"(\+\d{1,2}\s)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}")
    return bool(re.match(phone_pattern, token_text))

def extract_resume_info(text):
    nlp = spacy.load("en_core_web_sm")
    doc = nlp(text)

    resume_info = {
        "Name": None,
        "Email": None,
        "Phone": None,
        "Education": None,
        "Experience": None,
        "Projects": None,
        "Skills": None
    }

    sections = {
        "Education": [],
        "Experience": [],
        "Projects": [],
        "Skills": []
    }

    current_section = None

    for token in doc:
        if token.ent_type_ == "PERSON" and not resume_info["Name"]:
            resume_info["Name"] = token.text
        elif token.like_email and not resume_info["Email"]:
            resume_info["Email"] = token.text
        elif is_phone_number(token.text) and not resume_info["Phone"]:
            resume_info["Phone"] = token.text
        elif token.text.lower() in ["education", "experience", "projects", "skills"]:
            current_section = token.text.lower()
            if current_section not in sections:
                sections[current_section] = []  # Initialize section list if not exists
        elif current_section and token.pos_ != "PUNCT":
            sections[current_section].append(token.text)

    for key in sections:
        sections[key] = " ".join(sections[key])

    resume_info.update(sections)

    # Extracting skills up to the first named entity or end of document
    skills = []
    for token in doc:
        if token.pos_ == "NOUN" or token.pos_ == "PROPN":
            break
        if token.text.lower() != "skills":
            skills.append(token.text)
    resume_info["Skills"] = " ".join(skills)

    return resume_info

# Example usage
pdf_path = "resumes/Kartikay_Gupta_Resume.pdf"
resume_text = extract_text_from_pdf(pdf_path)
resume_info = extract_resume_info(resume_text)

print(resume_info)


# resumes/Aman_Adatia_SDE_Resume.pdf