class MultipartUploaderSpike
  CHUNK_SIZE = 6.megabytes

  def self.go
    client = Discourse.store.s3_helper.s3_client
    file_path = "./photos.zip"
    size = File.size(file_path)
    key = "multipart_test/#{SecureRandom.hex(10)}.zip"
    part_key = "multipart_test/#{SecureRandom.hex(10)}_PART_NUMBER.zip"
    puts "Uploading to #{key}."
    puts "File is #{size} bytes."

    neat_part_count, last_part_size = size.divmod(CHUNK_SIZE)
    total_part_count = neat_part_count
    if last_part_size.positive?
      total_part_count += 1
    end
    puts "Uploading #{total_part_count} parts. #{neat_part_count} parts match chunk size. Final part size is #{last_part_size} bytes."

    # what happens if you upload the same part twice?
    #
    # we can write metadata here at the same time, maybe we can
    # put the discourse stub upload id in the metadata?
    resp = client.create_multipart_upload(
      bucket: Discourse.store.s3_helper.s3_bucket_name,
      key: key
    )

    puts "Created multipart."
    puts resp.to_h
    part_responses = {}
    threads = []

    (1..neat_part_count).each do |part_number|
      threads << Thread.new do
        part_responses[part_number] = upload_part(client, file_path, key, resp.upload_id, part_number)
      end
    end
    threads.each(&:join)

    part_responses[total_part_count] = upload_part(client, file_path, key, resp.upload_id, total_part_count, final: last_part_size)

    # part_upload_resp_1 = client.upload_part({
    #   body: File.read(file_path, CHUNK_SIZE),
    #   bucket: Discourse.store.s3_helper.s3_bucket_name,
    #   key: key,
    #   part_number: 1,
    #   upload_id: resp.upload_id
    # })
    # puts "uploaded part 1"
    # part_upload_resp_2 = client.upload_part({
    #   body: File.read(file_path, CHUNK_SIZE),
    #   bucket: Discourse.store.s3_helper.s3_bucket_name,
    #   key: key,
    #   part_number: 1,
    #   upload_id: resp.upload_id
    # })
    #

    # parts must be in ascending order :rolleyes:
    parts_with_etags = part_responses.map do |part_number, part_response|
      { part_number: part_number, etag: part_response.etag }
    end.sort_by { |part| part[:part_number] }

    complete_resp = client.complete_multipart_upload({
      bucket: Discourse.store.s3_helper.s3_bucket_name, 
      key: key, 
      multipart_upload: {
        parts: parts_with_etags
      }, 
      upload_id: resp.upload_id, 
    })
  end

  def self.upload_part(client, file_path, key, upload_id, part_number, final: nil)
    offset = part_number == 1 ? 0 : ((part_number -1) * CHUNK_SIZE)
    puts "Uploading part #{part_number} at offset #{offset}..."
    puts "THIS IS THE FINAL PART." if final

    resp = client.upload_part({
      body: File.read(file_path, final || CHUNK_SIZE, offset),
      bucket: Discourse.store.s3_helper.s3_bucket_name,
      key: key,
      part_number: part_number,
      upload_id: upload_id
    })

    puts "Part #{part_number} done!"
    resp
  end
end
