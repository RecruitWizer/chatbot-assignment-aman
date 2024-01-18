from llama_index import GPTSimpteVectorIndex, SimpleDirectoryReader

documents = SimpleDirectoryReader('data').load_data()
index = GPTSimpteVectorIndex.from_documents(documents)
response = index.query("What did the author do growing up?" )
print(response)